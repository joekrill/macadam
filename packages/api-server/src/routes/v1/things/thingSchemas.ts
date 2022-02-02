import { z } from "zod";

export const thingCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  isPublic: z.boolean().default(false), // TODO: any way to extract this from the entity definition?
});

export const thingUpdateSchema = thingCreateSchema.extend({
  description: z.string().nullish().default(null),
});

export const thingUpdatePartialSchema = thingCreateSchema.extend({
  name: z.string().optional(),
  isPublic: z.boolean().optional(),
});
