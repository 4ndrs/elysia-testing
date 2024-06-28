import { swagger } from "@elysiajs/swagger";
import { Elysia, t } from "elysia";

const userSchema = t.Object({
  name: t.String(),
  color: t.String(),
});

const app = new Elysia()
  .use(swagger())
  .get("/", () => "Hello Elysia")
  .get(
    "/user/:id",
    ({ params: { id } }) => {
      console.log("received id:", id);

      return `Hello user ${id}`;
    },
    { params: t.Object({ id: t.Numeric() }) },
  )
  .post(
    "/user",
    ({ body, set }) => {
      const user = { id: 1, ...body };

      console.log("created user:", user);

      set.status = "Created";
      set.headers["x-powered-by"] = "Elysia";

      return { message: "User created", data: user };
    },
    {
      body: userSchema,
      response: { 201: t.Object({ message: t.String(), data: userSchema }) },
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
