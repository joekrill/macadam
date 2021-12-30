import { z } from "zod";
import { offsetPaginationResponseSchema } from "../../api/schemas/pagination";
import { successResponseSchema } from "../../api/schemas/response";
import { identitySchema } from "./identity";

export const sessionAuthenticationMethodMethodSchema = z.union([
  z.literal("link_recovery"),
  z.literal("password"),
  z.literal("totp"),
  z.literal("oidc"),
]);

/**
 * A singular authenticator used during authentication / login.
 */
export const authenticationMethodSchema = z.object({
  /**
   * When the authentication challenge was completed.
   */
  completed_at: z.string().nullish(),

  method: sessionAuthenticationMethodMethodSchema.nullish(),
});

/**
 * The authenticator assurance level can be one of \"aal1\", \"aal2\", or \"aal3\". A higher number means that it is harder for an attacker to compromise the account.  Generally, \"aal1\" implies that one authentication factor was used while AAL2 implies that two factors (e.g. password + TOTP) have been used.  To learn more about these levels please head over to: https://www.ory.sh/kratos/docs/concepts/credentials
 */
export const authenticatorAssuranceLevelSchema = z.union([
  z.literal("aal0"),
  z.literal("aal1"),
  z.literal("aal2"),
  z.literal("aal3"),
]);

export type AuthenticatorAssuranceLevel = z.infer<
  typeof authenticatorAssuranceLevelSchema
>;

export const sessionSchema = z.object({
  /**
   * Whether or not the session is active.
   */
  active: z.boolean().nullish(),

  /**
   * The Session Authentication Timestamp  When this session was authenticated at.
   */
  authenticated_at: z.string().nullish(),

  /**
   * A list of authenticators which were used to authenticate the session.
   */
  authentication_methods: z.array(authenticationMethodSchema).nullish(),

  authenticator_assurance_level: authenticatorAssuranceLevelSchema.nullish(),

  /**
   * The Session Expiry  When this session expires at.
   */
  expires_at: z.string().nullish(),

  id: z.string(),

  identity: identitySchema,

  /**
   * The Session Issuance Timestamp  When this session was authenticated at.
   */
  issued_at: z.string().nullish(),
});

export type Session = z.infer<typeof sessionSchema>;

/** List */

// TODO: find a better name for this?

export const sessionWithoutIdentitySchema = sessionSchema
  .omit({ identity: true })
  .extend({
    identity_id: z.string(),
    __caslSubjectType__: z
      .literal("KratosSession")
      .optional()
      .default("KratosSession"),
  });

export type SessionWithoutIdentity = z.infer<
  typeof sessionWithoutIdentitySchema
>;

export const listSessionsResponseSchema = successResponseSchema
  .merge(offsetPaginationResponseSchema)
  .extend({
    data: z.array(sessionWithoutIdentitySchema),
  });

export type ListSessionsResponse = z.infer<typeof listSessionsResponseSchema>;

export interface ListSessionsParams {
  page?: number;
  sort?: string;
}
