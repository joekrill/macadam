import { z } from "zod";
import { identitySchema } from "../identity";
import { selfServiceFlowCommonSchema } from "./common";

export const selfServiceRegistrationFlowSchema =
  selfServiceFlowCommonSchema.extend({});

export type SelfServiceRegistrationFlow = z.infer<
  typeof selfServiceRegistrationFlowSchema
>;

export const selfServiceRegistrationFlowSuccessSchema = z.object({
  identity: identitySchema,
});

export type SelfServiceRegistrationFlowSuccess = z.infer<
  typeof selfServiceRegistrationFlowSuccessSchema
>;

export function isSelfServiceRegistrationFlowSuccess(
  result?: SelfServiceRegistrationFlowSuccess | unknown
): result is SelfServiceRegistrationFlowSuccess {
  return (
    result !== undefined &&
    (result as SelfServiceRegistrationFlowSuccess).identity !== undefined
  );
}

export const selfServiceRegistrationFlowResponseSchema = z.union([
  selfServiceRegistrationFlowSuccessSchema,
  selfServiceRegistrationFlowSchema,
]);

export function isSelfServiceRegistrationFlow(
  result?: SelfServiceRegistrationFlow | unknown
): result is SelfServiceRegistrationFlow {
  return (
    result !== undefined &&
    (result as SelfServiceRegistrationFlow).ui !== undefined
  );
}
