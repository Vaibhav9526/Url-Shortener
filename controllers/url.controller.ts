import { nanoid } from "nanoid";
import db from "../db/index.ts";
import urlTable from "../models/url.models.ts";
import { urlGetBodySchema, urlPostRequestBodySchema } from "../validators/url.validators.ts";
import { and, eq } from "drizzle-orm";
import type { Request, Response } from "express";

export const postUrl = async (req: Request, res: Response) => {
  const user = req.user;
  const validation = await urlPostRequestBodySchema.safeParseAsync(req.body);

  if (!user) return res.status(401).json({ error: "not authorized" });

  if (validation.error) {
    return res.status(400).json({
      error: validation.error.format(),
    });
  }

  const { url, code } = validation.data;

  // * Check if the URL already exists in the database
  const existingUrl = await db.query.urlTable.findFirst({
    where: (table) => eq(table.url, url),
    columns: {
      shortCode: true,
    },
  });

  if (existingUrl) {
    return res.status(200).json({
      code: existingUrl.shortCode,
    });
  }

  // * check if the code already exists in the database
  if (code) {
    const existingCode = await db.query.urlTable.findFirst({
      where: (table) => eq(table.shortCode, code),
      columns: {
        shortCode: true,
      },
    });

    if (existingCode) return res.status(400).json({ existingCode });
  }

  const [result] = await db
    .insert(urlTable)
    .values({
      userId: user.id,
      url,
      shortCode: code ?? nanoid(6),
    })
    .returning({
      id: urlTable.id,
      shortCode: urlTable.shortCode,
    });

  if (!result) {
    return res.status(400).json({
      error: "error",
    });
  }

  res.status(201).json({
    message: `success creating ID ${result.id}`,
    code: result.shortCode,
  });
};

export const redirect = async (req: Request, res: Response) => {
  // const user = req.user;

  const validation = await urlGetBodySchema.safeParseAsync(req.params);
  // if (!user) return res.status(400).json("user not authorized");
  if (validation.error)
    return res.status(400).json({
      error: validation.error.format(),
    });

  const { code } = validation.data;

  const [result] = await db
    .select()
    .from(urlTable)
    .where((table) => and(eq(table.shortCode, code)));

  if (!result) return res.status(400).json("result error");

  res.redirect(result.url);
};

export const myUrl = async (req: Request, res: Response) => {
  const user = req.user!;

  const result = await db.query.urlTable.findMany({
    where: (table) => eq(table.userId, user.id),
  });

  if (!result) return res.status(400).json({ error: "error" });

  return res.status(200).json({
    result,
  });
};
