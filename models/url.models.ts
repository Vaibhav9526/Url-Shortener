import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import usersTable from "./schema.models.ts";

const urlTable = pgTable("url", {
  id: uuid().defaultRandom().primaryKey(),

  url: varchar({ length: 155 }).notNull(),
  shortCode: varchar("code", { length: 155 }).unique(),

  userId: uuid().references(() => usersTable.id),
});

export default urlTable;
