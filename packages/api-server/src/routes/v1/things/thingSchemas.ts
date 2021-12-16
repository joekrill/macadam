import { z } from "zod";

export const thingCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  isPrivate: z.boolean().default(true),
});

export const thingUpdateSchema = thingCreateSchema.extend({
  description: z.string().nullish().default(null),
});

export const thingUpdatePartialSchema = thingCreateSchema.extend({
  name: z.string().optional(),
  isPrivate: z.boolean().optional(),
});
