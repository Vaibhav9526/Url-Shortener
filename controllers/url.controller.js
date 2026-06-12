import { nanoid } from "nanoid";
import db from "../db/index.js";
import { urlTable } from "../models/url.models.js";
import {
  urlGetBodySchema,
  urlPostRequestBodySchema,
} from "../validators/url.validators.js";
import { and, eq } from "drizzle-orm";

/**
 *
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 *
 */

export const postUrl = async (req, res) => {
  const user = req.user;
  const validation = await urlPostRequestBodySchema.safeParseAsync(req.body);

  if (!user) return res.status(401).json({ error: "not authorized" });
  if (validation.error) {
    return res.status(400).json({
      error: validation.error.format(),
    });
  }

  const { url, code } = validation.data;

  const [result] = await db
    .insert(urlTable)
    .values({
      userId: user.id,
      url,
      shortCode: code ?? nanoid(6),
    })
    .returning({
      id: urlTable.id,
    });

  if (!result) {
    return res.status(400).json({
      error: "error",
    });
  }

  res.status(201).json({
    message: `success creating ID ${result.id}`,
  });
};

export const redirect = async (req, res) => {
  const user = req.user;

  const validation = await urlGetBodySchema.safeParseAsync(req.params);
  if (!user) return res.status(400).json("user not authorized");
  if (validation.error)
    return res.status(400).json({
      error: validation.error.format(),
    });

  const { code } = validation.data;

  const [result] = await db
    .select()
    .from(urlTable)
    .where((table) =>
      and(eq(table.shortCode, code), eq(table.userId, user.id)),
    );

  if (!result) return res.status(400).json("result error");

  res.redirect(result.url);
};
