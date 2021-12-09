import { z } from "zod";

export const linkUrlSchema = z.string().url();

export const linkObjetSchema = z.object({
  href: linkUrlSchema,
  meta: z.object({}).passthrough().optional(),
});

export const linkSchema = z.union([linkUrlSchema, linkObjetSchema]);

export const linksSchema = z.record(linkSchema);
