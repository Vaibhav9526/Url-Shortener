import { pgTable, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstname: varchar("first_name", { length: 55 }).notNull(),
  lastname: varchar("last_name", { length: 55 }),

  email: varchar("email", { length: 100 }).notNull().unique(),

  role: text("role", { enum: ["USER", "ADMIN"] }).default("USER"),

  password: text("password").notNull(),
  salt: text("salt").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export default usersTable;
