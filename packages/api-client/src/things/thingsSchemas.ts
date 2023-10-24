import { z } from "zod";
import {
  changedBy,
  omitChangedBy,
  omitTimestamps,
  omitUuid,
  timestamps,
  uuid,
} from "../api/schemas/common";
import { offsetPaginationResponseSchema } from "../api/schemas/pagination";
import { successResponseSchema } from "../api/schemas/response";

export const thingSchema = uuid
  .merge(timestamps)
  .merge(changedBy)
  .extend({
    // This allows us to use Casl checks on the parsed result.
    __caslSubjectType__: z.literal("Thing").default("Thing"),

    name: z.string(),
    description: z.string().optional(),
    isPublic: z.boolean(),
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
  search?: string;
}

/** Get */

export const getThingResponseSchema = successResponseSchema.extend({
  data: thingSchema,
});

export type GetThingResponse = z.infer<typeof getThingResponseSchema>;

/** Create */

export const createThingParamsSchema = thingSchema
  .extend({
    name: z.string().min(3),
  })
  .omit(omitUuid)
  .omit(omitTimestamps)
  .omit(omitChangedBy)
  .omit({ __caslSubjectType__: true });

export type CreateThingParams = z.infer<typeof createThingParamsSchema>;

export const createThingResponseSchema = getThingResponseSchema;

export type CreateThingResponse = z.infer<typeof createThingResponseSchema>;

/** Update */

export const updateThingParamsSchema = thingSchema
  .extend({
    name: z.string().min(3),
  })
  .omit(omitTimestamps)
  .omit(omitChangedBy)
  .omit({ __caslSubjectType__: true })
  .partial()
  .extend({
    id: thingSchema.shape.id,
  });

export type UpdateThingParams = z.infer<typeof updateThingParamsSchema>;

export const updateThingResponseSchema = getThingResponseSchema;

export type UpdateThingResponse = z.infer<typeof updateThingResponseSchema>;
