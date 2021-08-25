import { z } from "zod";
import { selfServiceFlowCommonSchema } from "./common";

/**
 * This request is used when an identity wants to recover their account.  We recommend reading the [Account Recovery Documentation](../self-service/flows/password-reset-account-recovery)
 */
export const selfServiceRecoveryFlowSchema = selfServiceFlowCommonSchema.extend(
  {
    state: z.union([
      z.literal("choose_method"),
      z.literal("sent_email"),
      z.literal("passed_challenge"),
    ]),
  }
);

export type SelfServiceRecoveryFlow = z.infer<
  typeof selfServiceRecoveryFlowSchema
>;
