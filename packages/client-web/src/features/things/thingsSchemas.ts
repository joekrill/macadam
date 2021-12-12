import { z } from "zod";
import { offsetPaginationResponseSchema } from "../api/schemas/pagination";
import { successResponseSchema } from "../api/schemas/response";

export const thingSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: z.string(),
  updatedBy: z.string(),
  isPrivate: z.boolean(),
});

export type Thing = z.infer<typeof thingSchema>;

/** List */

export const listThingsResponseSchema = successResponseSchema
  .merge(offsetPaginationResponseSchema)
  .extend({
    data: z.array(thingSchema),
  });

export type ListThingsResponse = z.infer<typeof listThingsResponseSchema>;

export interface ListThingsParams {
  page?: number;
  owned?: boolean;
  sort?: string;
}

/** Get */

export const getThingResponseSchema = successResponseSchema.extend({
  data: thingSchema,
});

export type GetThingResponse = z.infer<typeof getThingResponseSchema>;

/** Create */

export const createThingParamsSchema = thingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export type CreateThingParams = z.infer<typeof createThingParamsSchema>;

export const createThingResponseSchema = getThingResponseSchema;

export type CreateThingResponse = z.infer<typeof createThingResponseSchema>;

/** Update */

export const updateThingParamsSchema = thingSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .extend({
    name: z.string().optional(),
  });

export type UpdateThingParams = z.infer<typeof updateThingParamsSchema>;

export const updateThingResponseSchema = getThingResponseSchema;

export type UpdateThingResponse = z.infer<typeof updateThingResponseSchema>;
