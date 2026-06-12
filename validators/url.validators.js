import { optional, z } from "zod";

export const urlPostRequestBodySchema = z.object({
  url: z.url(),
  code: z.string().optional(),
});

export const urlGetBodySchema = z.object({
  code: z.string(),
});
