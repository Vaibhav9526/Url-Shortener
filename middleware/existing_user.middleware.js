import { eq } from "drizzle-orm";
import db from "../db/index.js";
import usersTable from "../models/schema.models.js";
import { signupPostRequestSchema } from "../validators/users.validators.js";

export const existingUserEmail = async (req, res, next) => {
  const validators = await signupPostRequestSchema.safeParseAsync(req.body);
  if (validators.error)
    return res.status(400).json({
      error: validators.error.format(),
    });
  const email = validators.data.email;
  const [exUser] = await db
    .select({
      email: usersTable.email,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (exUser)
    return res.status(400).json({
      error: `user with email ${exUser.email} already exists`,
    });

  next();
};
