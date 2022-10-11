import { z } from "zod";

export const validationIssue = z.object({
  message: z.string(),
  path: z.array(z.union([z.string(), z.number()])),
});

export const baseErrorSchema = z.object({
  name: z.string().optional(),
  statusCode: z.number().optional(),
  message: z.string(),
});

export const validationErrorSchema = baseErrorSchema.extend({
  issues: z.array(validationIssue),
});

export type ValidationError = z.infer<typeof validationErrorSchema>;

export const errorSchema = z.union([baseErrorSchema, validationErrorSchema]);
