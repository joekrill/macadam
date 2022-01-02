import { z } from "zod";
import { offsetPaginationResponseSchema } from "../api/schemas/pagination";
import { successResponseSchema } from "../api/schemas/response";
import { sessionSchema } from "../auth/schemas/session";

/**
 * The schema for a session as it is returned from the api-server.
 * This differs from the Session that comes from the Kratos server, in that
 * it doesn't include the nested `identity`
 */
export const apiSessionSchema = sessionSchema.omit({ identity: true }).extend({
  identity_id: z.string(),
  __caslSubjectType__: z
    .literal("KratosSession")
    .optional()
    .default("KratosSession"),
});

export type ApiSession = z.infer<typeof apiSessionSchema>;

export const listSessionsResponseSchema = successResponseSchema
  .merge(offsetPaginationResponseSchema)
  .extend({
    data: z.array(apiSessionSchema),
  });

export type ListSessionsResponse = z.infer<typeof listSessionsResponseSchema>;

export interface ListSessionsParams {
  page?: number;
  sort?: string;
}
