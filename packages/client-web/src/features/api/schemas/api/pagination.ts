import { z } from "zod";

export const offsetPaginationSchema = z.object({
  offset: z.number(),
  limit: z.number(),
  count: z.number(),
  page: z.number(),
  totalCount: z.number().optional(),
  totalPages: z.number().optional(),
});

export const offsetPaginationResponseSchema = z.object({
  pagination: offsetPaginationSchema,
});
