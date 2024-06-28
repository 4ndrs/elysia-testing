import { z } from "zod";
import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/user/:id", ({ params: { id } }) => {
    console.log("received id:", id);

    return `Hello user ${id}`;
  })
  .post("/user", ({ body }) => {
    const parsedUser = UserSchema.safeParse(body);

    if (!parsedUser.success) {
      const errors = parsedUser.error.flatten().fieldErrors;

      console.log("received invalid user schema:", errors);

      return new Response(
        JSON.stringify({ message: "Invalid fields", errors }),
        { status: 422 },
      );
    }

    const user = { id: 1, ...parsedUser.data };

    console.log("created user:", user);

    return new Response(
      JSON.stringify({ message: "User created", data: user }),
      {
        status: 201,
      },
    );
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

const UserSchema = z.object({
  name: z.string(),
  color: z.string(),
});
