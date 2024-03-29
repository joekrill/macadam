import { z } from "zod";
import { flowCommonSchema } from "./common";

/**
 * Used to verify an out-of-band communication channel such as an email address or a phone number.  For more information head over to: https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation
 */
export const verificationFlowSchema = flowCommonSchema.extend({
  expires_at: z.string().nullish(),

  issued_at: z.string().nullish(),

  request_url: z.string().nullish(),

  state: z.union([
    z.literal("choose_method"),
    z.literal("sent_email"),
    z.literal("passed_challenge"),
  ]),
});

export type VerificationFlow = z.infer<typeof verificationFlowSchema>;
