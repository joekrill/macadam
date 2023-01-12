import { z } from "zod";

export const genericErrorSchema = z.object({
  /**
   * The status code
   */
  code: z.number().optional(),

  /**
   * Debug information  This field is often not exposed to protect against leaking sensitive information.
   */
  debug: z.string().optional(),

  /**
   * Further error details
   */
  details: z.unknown().optional(),

  /**
   * The error ID  Useful when trying to identify various errors in application logic.
   */
  id: z.string().optional(),

  /**
   * Error message  The error\'s message.
   */
  message: z.string(),

  /**
   * A human-readable reason for the error
   */
  reason: z.string().optional(),

  /**
   * The request ID  The request ID is often exposed internally in order to trace errors across service architectures. This is often a UUID.
   */
  request: z.string().optional(),

  /**
   * The status description
   */
  status: z.string().optional(),
});

/**
 * 2FA is enabled and enforced, but user did not perform 2fa yet!
 */
export const ERROR_SESSION_AAL2_REQUIRED = "session_aal2_required";

/**
 * User is already signed in, let's redirect them home!
 */
export const ERROR_SESSION_ALREADY_AVAILABLE = "session_already_available";

/**
 * We need to re-authenticate to perform this action
 */
export const ERROR_SESSION_REFRESH_REQUIRED = "session_refresh_required";

/**
 * The flow expired, let's request a new one.
 */
export const ERROR_SELF_SERVICE_FLOW_RETURN_TO_FORBIDDEN =
  "self_service_flow_return_to_forbidden";

/**
 * The flow expired, let's request a new one.
 */
export const ERROR_SELF_SERVICE_FLOW_EXPIRED = "self_service_flow_expired";

/**
 * A CSRF violation occurred. Best to just refresh the flow!
 */
export const ERROR_SECURITY_CSRF_VIOLATION = "security_csrf_violation";

/**
 * The requested item was intended for someone else. Let's request a new flow...
 */
export const ERROR_SECURITY_IDENTITY_MISMATCH = "security_identity_mismatch";

/**
 * Ory Kratos asked us to point the user to this URL.
 */
export const ERROR_BROWSER_LOCATION_CHANGE_REQUIRED =
  "browser_location_change_required";

export const ERROR_OTHER = "other";

export const FLOW_RESTART_ERRORS = [
  ERROR_SELF_SERVICE_FLOW_RETURN_TO_FORBIDDEN,
  ERROR_SECURITY_IDENTITY_MISMATCH,
  ERROR_SECURITY_CSRF_VIOLATION,
  ERROR_SELF_SERVICE_FLOW_EXPIRED,
] as const;

export type FlowRestartReason = (typeof FLOW_RESTART_ERRORS)[number];

export function isFlowRestartError(id?: string): id is FlowRestartReason {
  return (
    typeof id === "string" &&
    FLOW_RESTART_ERRORS.includes(id as FlowRestartReason)
  );
}

export const FLOW_REDIRECT_ERRORS = [
  ERROR_SESSION_REFRESH_REQUIRED,
  ERROR_BROWSER_LOCATION_CHANGE_REQUIRED,
  ERROR_SESSION_AAL2_REQUIRED,
] as const;

export type FlowRedirectReason = (typeof FLOW_REDIRECT_ERRORS)[number];

export function isFlowRedirectError(id?: string): id is FlowRedirectReason {
  return (
    typeof id === "string" &&
    FLOW_REDIRECT_ERRORS.includes(id as FlowRedirectReason)
  );
}

export const flowErrorSchema = z
  .object({
    error: genericErrorSchema,
    redirect_browser_to: z.string().optional(),
  })
  .passthrough();

export const sessionAlreadyEstablishedErrorSchema = z.object({
  error: genericErrorSchema.extend({
    id: z.literal(ERROR_SESSION_ALREADY_AVAILABLE),
  }),
});

export const sessionAal2RequiredErrorSchema = z.object({
  error: genericErrorSchema.extend({
    id: z.literal(ERROR_SESSION_AAL2_REQUIRED),
  }),
});

export const sessionRefreshRequiredErrorSchema = z.object({
  error: genericErrorSchema.extend({
    id: z.literal(ERROR_SESSION_REFRESH_REQUIRED),
  }),
});

export type FlowError = z.infer<typeof flowErrorSchema>;
