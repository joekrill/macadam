import { z } from "zod";
import { identitySchema } from "../identity";
import { sessionSchema } from "../session";
import { flowCommonSchema } from "./common";

export const registrationFlowSchema = flowCommonSchema.extend({});

export type RegistrationFlow = z.infer<typeof registrationFlowSchema>;

export const registrationFlowSuccessSchema = z.object({
  identity: identitySchema,
  session: sessionSchema.optional(),
  session_token: z.string().optional(),
});

export type RegistrationFlowSuccess = z.infer<
  typeof registrationFlowSuccessSchema
>;

export function isRegistrationFlowSuccess(
  result?: RegistrationFlowSuccess | unknown,
): result is RegistrationFlowSuccess {
  return (
    result !== undefined &&
    (result as RegistrationFlowSuccess).identity !== undefined
  );
}

export const registrationFlowResponseSchema = z.union([
  registrationFlowSuccessSchema,
  registrationFlowSchema,
]);

export type RegistrationFlowResponse = z.infer<
  typeof registrationFlowResponseSchema
>;

export function isRegistrationFlow(
  result?: RegistrationFlow | unknown,
): result is RegistrationFlow {
  return result !== undefined && (result as RegistrationFlow).ui !== undefined;
}
