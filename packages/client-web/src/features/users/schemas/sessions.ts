import { z } from "zod";
import { offsetPaginationResponseSchema } from "../../api/schemas/pagination";
import { successResponseSchema } from "../../api/schemas/response";

export const sessionSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(), //date
    updatedAt: z.string(), // date
    nid: z.string(),
    issuedAt: z.string(), //date
    expiresAt: z.string(), //date
    authenticatedAt: z.string(), //date
    identity: z.string(),
    token: z.string(),
    active: z.boolean(),
    logoutToken: z.string(),
    aal: z.string(),
    // authenticationMethods	[ {…}, {…} ]
    // 0	Object { method: "password", completed_at: "2021-12-01T01:35:41.44154963Z" }
    // method	"password"
    // completed_at	"2021-12-01T01:35:41.44154963Z"
    // 1	Object { method: "password", completed_at: "2021-12-01T02:47:23.477120425Z" }
    // method	"password"
    // completed_at
  })
  .passthrough();

export const listSessionsResponseSchema = successResponseSchema
  .merge(offsetPaginationResponseSchema)
  .extend({
    data: z.array(sessionSchema),
  });

export type ListSessionsResponse = z.infer<typeof listSessionsResponseSchema>;

export type ListSessionsParams = void;
