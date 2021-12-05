import { z } from "zod";

export const thingCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const thingUpdateSchema = z.object({
  name: z.string(),
  description: z.string().nullish().default(null),
});

export const thingUpdatePartialSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
