import { z } from "zod";
import { successResponseSchema } from "../../api/schemas/response";

export const permissionsResponseSchema = successResponseSchema.extend({
  data: z.object({
    rules: z.unknown(),
  }),
});

export type PermissionsResponse = z.infer<typeof permissionsResponseSchema>;
