import { z } from "zod";

// TODO: customize based on current traits.
export const traitsSchema = z.object({
  name: z
    .object({
      first: z.string().nullish(),
      last: z.string().nullish(),
    })
    .nullish(),
  email: z.string(),
});

/**
 * VerifiableAddress is an identity\'s verifiable address
 */
export const verifiableIdentityAddressSchema = z.object({
  /**
   * When this entry was created
   */
  created_at: z.string().nullish(),

  id: z.string(),

  /**
   * VerifiableAddressStatus must not exceed 16 characters as that is the limitation in the SQL Schema
   */
  status: z.string(),

  /**
   * When this entry was last updated
   */
  updated_at: z.string().nullish(),

  /**
   * The address value  example foo@user.com
   */
  value: z.string(),

  /**
   * Indicates if the address has already been verified
   */
  verified: z.boolean(),

  verified_at: z.string().nullish(),

  /**
   * VerifiableAddressType must not exceed 16 characters as that is the limitation in the SQL Schema
   */
  via: z.string(),
});

export const recoveryAddressSchema = z.object({
  created_at: z.string().nullish(),

  id: z.string(),

  updated_at: z.string().nullish(),

  value: z.string(),

  via: z.string(),
});

export const identityCredentialsTypeSchema = z.union([
  z.literal("password"),
  z.literal("totp"),
  z.literal("oidc"),
]);

/**
 * Credentials represents a specific credential type
 */
export const identityCredentialsSchema = z.object({
  config: z.object({}).passthrough().nullish(),

  created_at: z.string().nullish(),

  /**
   * Identifiers represents a list of unique identifiers this credential type matches.
   */
  identifiers: z.array(z.string()).nullish(),

  type: identityCredentialsTypeSchema.nullish(),

  /**
   * UpdatedAt is a helper struct field for gobuffalo.pop.
   */
  updated_at: z.string().nullish(),
});

export const identityStateSchema = z.union([
  z.literal("active"),
  z.literal("inactive"),
]);

/**
 * An identity can be a real human, a service, an IoT device - everything that can be described as an \"actor\" in a system.
 */
export const identitySchema = z.object({
  created_at: z.string().nullish(),

  /**
   * Credentials represents all credentials that can be used for authenticating this identity.
   */
  credentials: z.record(identityCredentialsSchema).nullish(),

  id: z.string(),

  /**
   * RecoveryAddresses contains all the addresses that can be used to recover an identity.
   */
  recovery_addresses: z.array(recoveryAddressSchema).nullish(),

  /**
   * SchemaID is the ID of the JSON Schema to be used for validating the identity\'s traits.
   */
  schema_id: z.string(),

  /**
   * SchemaURL is the URL of the endpoint where the identity\'s traits schema can be fetched from.  format: url
   */
  schema_url: z.string(),

  /**
   * State is the identity\'s state.
   */
  state: identityStateSchema.nullable(),

  state_changed_at: z.string().nullish(),

  /**
   * Traits represent an identity\'s traits. The identity is able to create, modify, and delete traits in a self-service manner. The input will always be validated against the JSON Schema defined in `schema_url`.
   */
  traits: traitsSchema.nullish(),

  /**
   * UpdatedAt is a helper struct field for gobuffalo.pop.
   */
  updated_at: z.string().nullish(),

  /**
   * VerifiableAddresses contains all the addresses that can be verified by the user.
   */
  verifiable_addresses: z.array(verifiableIdentityAddressSchema).nullish(),
});

export type Identity = z.infer<typeof identitySchema>;
