import { signupPostRequestSchema } from "../validators/users.validators.ts";
import { signInPostRequestScheme } from "../validators/users.validators.ts";
import db from "../db/index.ts";
import { eq } from "drizzle-orm";
import usersTable from "../models/schema.models.ts";
import { hashPassword } from "../services/hash.service.ts";
import { createHmac, randomBytes } from "node:crypto";
import { jwtBind } from "../services/jwt.service.ts";
import type { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {
  const validation = await signupPostRequestSchema.safeParseAsync(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error.format(),
    });
  }
  const { firstname, lastname, email, password } = validation.data;
  const salt = randomBytes(256).toString("hex");
  const hashPass = hashPassword(password, salt);
  await db.insert(usersTable).values({
    firstname,
    lastname,
    email,
    password: hashPass,
    salt,
  });

  res.status(201).json({
    message: "user created successfully",
  });
};

export const signIn = async (req: Request, res: Response) => {
  const validation = await signInPostRequestScheme.safeParseAsync(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error.format,
    });
  }
  const { email, password } = validation.data;

  const [data] = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      salt: usersTable.salt,
    })
    .from(usersTable)
    .where((table) => eq(table.email, email));

  if (!data)
    return res.status(400).json({
      error: `No user with ${email} exist`,
    });

  const deHash = createHmac("sha256", data.salt).update(password).digest("hex");

  if (deHash !== data.password)
    return res.status(400).json({
      error: `wrong password`,
    });

  const payload: { id: string } = {
    id: data.id,
  };
  const token = jwtBind(payload);

  res.status(200).json({
    token: token,
  });
};
