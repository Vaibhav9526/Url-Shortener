import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../models/index.ts";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

export default db;
