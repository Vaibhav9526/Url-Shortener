import {
  integer,
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),

  firstname: varchar("user_name", { length: 55 }).notNull(),
  lastname: varchar({ length: 55 }),

  email: varchar({ length: 100 }).notNull().unique(),

  password: text().notNull(),
  salt: text().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export { usersTable };
export default usersTable;
