import { z } from "zod";
import { sessionSchema } from "../session";
import { selfServiceFlowCommonSchema } from "./common";

export const selfServiceLoginFlowSchema = selfServiceFlowCommonSchema.extend({
  created_at: z.string().optional(),

  /**
   * Forced stores whether this login flow should enforce re-authentication.
   */
  forced: z.boolean().optional(),

  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL\'s path or query for example.
   */
  request_url: z.string(),

  updated_at: z.string().optional(),
});

const selfServiceLoginFlowSuccessSchema = z.object({
  session: sessionSchema,
});

export const selfServiceLoginFlowResponseSchema = z.union([
  selfServiceLoginFlowSuccessSchema,
  selfServiceLoginFlowSchema,
]);

export type SelfServiceLoginFlow = z.infer<typeof selfServiceLoginFlowSchema>;

export type SelfServiceLoginFlowSuccess = z.infer<
  typeof selfServiceLoginFlowSuccessSchema
>;

export function isSelfServiceLoginFlow(
  result?: SelfServiceLoginFlow | unknown
): result is SelfServiceLoginFlow {
  return selfServiceLoginFlowSchema.safeParse(result).success;
}

export function isSelfServiceLoginFlowSuccess(
  result?: SelfServiceLoginFlowSuccess | unknown
): result is SelfServiceLoginFlowSuccess {
  return selfServiceLoginFlowSuccessSchema.safeParse(result).success;
}
