import { z } from "zod";
import {
  AuthenticatorAssuranceLevel,
  authenticatorAssuranceLevelSchema,
  sessionSchema,
} from "../session";
import { flowCommonSchema, InitializeFlowParams } from "./common";

export interface InitializeLoginFlowParams extends InitializeFlowParams {
  aal?: AuthenticatorAssuranceLevel;
  refresh?: boolean;
}

export const loginFlowSchema = flowCommonSchema.extend({
  created_at: z.string().optional(),

  /**
   * Refresh stores whether this login flow should enforce re-authentication.
   */
  refresh: z.boolean().optional(),

  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL\'s path or query for example.
   */
  request_url: z.string(),

  requested_aal: authenticatorAssuranceLevelSchema.optional(),

  updated_at: z.string().optional(),
});

export type LoginFlow = z.infer<typeof loginFlowSchema>;

export function isLoginFlow(result?: LoginFlow | unknown): result is LoginFlow {
  return loginFlowSchema.safeParse(result).success;
}

const loginFlowSuccessSchema = z.object({
  session: sessionSchema,
});

export type LoginFlowSuccess = z.infer<typeof loginFlowSuccessSchema>;

export function isLoginFlowSuccess(
  result?: LoginFlowSuccess | unknown
): result is LoginFlowSuccess {
  return loginFlowSuccessSchema.safeParse(result).success;
}

export const loginFlowResponseSchema = z.union([
  loginFlowSuccessSchema,
  loginFlowSchema,
]);

export type LoginFlowResponse = z.infer<typeof loginFlowResponseSchema>;
