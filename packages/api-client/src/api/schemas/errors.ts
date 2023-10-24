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

export const isNotFoundError = (error: unknown) => {
  if (error === null || error === undefined) {
    return false;
  }

  if (typeof error !== "object" && typeof error !== "function") {
    return false;
  }

  if ("code" in error && Number(error.code) === 404) {
    return true;
  }

  if ("status" in error && Number(error.status) === 404) {
    return true;
  }

  if ("originalStatus" in error && Number(error.originalStatus) === 404) {
    return true;
  }

  return false;
};
