import { z } from "zod";
import { errorSchema } from "./errors";
import { linksSchema } from "./links";

export const successResponseSchema = z.object({
  data: z.unknown().optional(),
  links: linksSchema.optional(),
});

export const errorResponseSchema = z.object({
  errors: z.array(errorSchema).optional(),
});
