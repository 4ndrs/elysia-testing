import { eq } from "drizzle-orm";
import { db } from "../db";
import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";
import { testUserTable } from "../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

const userInsertSchema = createInsertSchema(testUserTable);
const userSelectSchema = createSelectSchema(testUserTable);

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .get(
    "/users",
    async () => {
      const users = await db.select().from(testUserTable);

      return { data: users };
    },
    { response: { 200: t.Object({ data: t.Array(userSelectSchema) }) } },
  )
  .delete(
    "/users/:id",
    async ({ params: { id }, set }) => {
      await db.delete(testUserTable).where(eq(testUserTable.id, id));

      set.status = "No Content";
    },
    { params: t.Object({ id: t.Numeric() }) },
  )
  .get(
    "/users/:id",
    async ({ params: { id }, error }) => {
      const results = await db
        .select()
        .from(testUserTable)
        .where(eq(testUserTable.id, id));

      if (results.length === 0) {
        return error(404, "User not found");
      }

      const user = results[0];

      console.log("found user:", user);

      return { data: user };
    },
    { params: t.Object({ id: t.Numeric() }) },
  )
  .post(
    "/users",
    async ({ body, set }) => {
      const newUser = body;

      const user = (
        await db.insert(testUserTable).values(newUser).returning()
      )[0];

      console.log("new user:", user);

      set.status = "Created";
      set.headers["x-powered-by"] = "Elysia";

      return { message: "User created", data: user };
    },
    {
      body: userInsertSchema,
      response: {
        201: t.Object({ message: t.String(), data: userSelectSchema }),
      },
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
