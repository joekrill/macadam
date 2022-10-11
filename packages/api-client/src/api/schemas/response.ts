import { z } from "zod";
import { errorSchema, validationErrorSchema } from "./errors";
import { linksSchema } from "./links";

export const successResponseSchema = z.object({
  data: z.unknown().optional(),
  links: linksSchema.optional(),
});

export const errorResponseSchema = z.object({
  error: errorSchema,
});

export const validationErrorResponseSchema = z.object({
  error: validationErrorSchema,
});
