import { z } from "zod";
import { identitySchema } from "./identity";
import { sessionSchema } from "./session";
import { UiContainer, uiContainerSchema } from "./ui";

export type SelfServiceFlowType =
  | "login"
  | "registration"
  | "recovery"
  | "verification"
  | "settings";

export const flowTypeSchema = z.union([z.literal("api"), z.literal("browser")]);

/******************************************
 * Logout
 *****************************************/

export const selfServiceLogoutUrlSchema = z.object({
  logout_url: z.string(),
});

export type SelfServiceLogoutUrl = z.infer<typeof selfServiceLogoutUrlSchema>;

export const selfServiceFlowCommonSchema = z.object({
  active: z.string().nullish(),

  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user wishes to continue, a new flow has to be initiated.
   */
  expires_at: z.string(),

  id: z.string(),

  /**
   * IssuedAt is the time (UTC) when the flow started.
   */
  issued_at: z.string(),

  request_url: z.string(),

  /**
   * The flow type can either be `api` or `browser`.
   */
  type: flowTypeSchema.nullish(),

  ui: uiContainerSchema,
});

/******************************************
 * Login
 *****************************************/

export const selfServiceLoginFlowSchema = selfServiceFlowCommonSchema.extend({
  created_at: z.string().nullish(),

  expires_at: z.string(),

  type: flowTypeSchema,

  /**
   * Forced stores whether this login flow should enforce re-authentication.
   */
  forced: z.boolean().nullish(),

  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used to forward information contained in the URL\'s path or query for example.
   */
  request_url: z.string(),

  updated_at: z.string().nullish(),
});

export type SelfServiceLoginFlow = z.infer<typeof selfServiceLoginFlowSchema>;

export const selfServiceLoginFlowSuccessSchema = z.object({
  session: sessionSchema,
});

export const selfServiceLoginFlowResponseSchema = z.union([
  selfServiceLoginFlowSuccessSchema,
  selfServiceLoginFlowSchema,
]);

export type SelfServiceLoginFlowSuccess = z.infer<
  typeof selfServiceLoginFlowSuccessSchema
>;

export function isSelfServiceLoginFlow(
  result?: SelfServiceLoginFlow | unknown
): result is SelfServiceLoginFlow {
  return (
    result !== undefined && (result as SelfServiceLoginFlow).ui !== undefined
  );
}

export function isSelfServiceLoginFlowSuccess(
  result?: SelfServiceLoginFlowSuccess | unknown
): result is SelfServiceLoginFlowSuccess {
  return (
    result !== undefined &&
    (result as SelfServiceLoginFlowSuccess).session !== undefined
  );
}

/******************************************
 * Registration
 *****************************************/

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

export const hasError = (ui: UiContainer, error: number) => {
  return ui.messages?.some(({ id }) => id === error) || false;
};

/******************************************
 * Recovery
 *****************************************/

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

/******************************************
 * Verification
 *****************************************/

/**
 * Used to verify an out-of-band communication channel such as an email address or a phone number.  For more information head over to: https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation
 */
export const selfServiceVerificationFlowSchema =
  selfServiceFlowCommonSchema.extend({
    expires_at: z.string().nullish(),

    issued_at: z.string().nullish(),

    request_url: z.string().nullish(),

    state: z.union([
      z.literal("choose_method"),
      z.literal("sent_email"),
      z.literal("passed_challenge"),
    ]),
  });

export type SelfServiceVerificationFlow = z.infer<
  typeof selfServiceVerificationFlowSchema
>;

// export const selfServiceVerificationFlowSuccessSchema = z.object({
//   identity: identitySchema,
// });

// export type SelfServiceVerificationFlowSuccess = z.infer<
//   typeof selfServiceVerificationFlowSuccessSchema
// >;

/******************************************
 * Settings
 *****************************************/

/**
 * This flow is used when an identity wants to update settings (e.g. profile data, passwords, ...) in a selfservice manner.  We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
 */
export const selfServiceSettingsFlowSchema = selfServiceFlowCommonSchema.extend(
  {
    identity: identitySchema,
    state: z.union([z.literal("show_form"), z.literal("success")]),
  }
);

export const selfServiceSettingsFlowSubmitResponseSchema = z.object({
  identity: identitySchema,
  flow: selfServiceSettingsFlowSchema,
});

export type SelfServiceSettingsFlow = z.infer<
  typeof selfServiceSettingsFlowSchema
>;

export const selfServiceFlowSchema = z.union([
  selfServiceLoginFlowSchema,
  selfServiceRegistrationFlowSchema,
  selfServiceVerificationFlowSchema,
  selfServiceRecoveryFlowSchema,
  selfServiceSettingsFlowSchema,
]);

export type SelfServiceFlow = z.infer<typeof selfServiceFlowSchema>;
