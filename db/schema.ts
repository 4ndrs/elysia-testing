import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const testUserTable = sqliteTable("test_user", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  color: text("color").notNull(),
});
