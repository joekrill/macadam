import { z } from "zod";
import { successResponseSchema } from "../../api/schemas/response";
import { sessionSchema } from "./session";

export const whoamiResponseSchema = successResponseSchema.extend({
  data: z.object({
    session: sessionSchema.optional(),
    rules: z.unknown(),
  }),
});

export type WhoamiResponse = z.infer<typeof whoamiResponseSchema>;
