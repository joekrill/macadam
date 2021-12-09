import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "../../errors/components/ErrorAlert/ErrorAlert";
import { useFlowError } from "../hooks/useFlowError";
import {
  ERROR_SESSION_ALREADY_AVAILABLE,
  FlowRestartReason,
} from "../schemas/errors";
import { SelfServiceFlowName } from "../schemas/flows";
import { LoggedInNotice } from "./login/LoggedInNotice";

export interface FlowErrorProps
  extends Omit<ErrorAlertProps, "children" | "status" | "onRetryClick"> {
  error?: FetchBaseQueryError | SerializedError;
  onRestartFlow: (reason?: FlowRestartReason) => void;
  flowType: SelfServiceFlowName;
}

export const FlowError = ({
  error,
  flowType,
  onRestartFlow,
  ...errorAlertProps
}: FlowErrorProps) => {
  const { statusCode, id, redirectTo, isRedirectToError, isRestartError } =
    useFlowError(error);

  useEffect(() => {
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  useEffect(() => {
    if (isRestartError) {
      onRestartFlow(id as FlowRestartReason);
    }
  }, [id, onRestartFlow, isRestartError]);

  if (
    id === ERROR_SESSION_ALREADY_AVAILABLE ||
    (flowType === "recovery" && statusCode === 400)
  ) {
    // session_already_available
    return <LoggedInNotice onLogout={() => onRestartFlow()} />;
  }

  if (isRedirectToError) {
    // session_refresh_required
    // browser_location_change_required
    // session_aal2_required
    const hasRedirect = !!redirectTo;

    return (
      <ErrorAlert
        error={error}
        {...errorAlertProps}
        status={hasRedirect ? "info" : "error"}
        // We _should_ have been given a redirect, but we weren't, so show the
        // generic error message and allow the user to restart the flow.
        onRetryClick={hasRedirect ? undefined : () => onRestartFlow()}
      >
        {hasRedirect && (
          <FormattedMessage
            id="auth.flowError.redirecting"
            defaultMessage="{reason, select, session_refresh_required {Reauthentication required. } browser_location_change_required {} session_aal2_required {2FA required. } other {}}Redirecting..."
            values={{ reason: id }}
          />
        )}
      </ErrorAlert>
    );
  }

  if (isRestartError) {
    // self_service_flow_return_to_forbidden
    // security_identity_mismatch
    // security_csrf_violation
    // self_service_flow_expired

    // We don't want to show anything here. The login form will show a message
    // indicating a restart was required.
    return null;
  }

  if (id === "session_verified_address_required") {
    // TODO:
    // show a message and a link to the verification request page
  }

  if (id === "session_inactive") {
    // TODO:
    // No Ory Session was found - sign in a user first.
    // If this is a login flow, show an error message with retry option
    // otherwise; redirect to login page
  }

  if (id === "session_aal_already_fulfilled") {
    // TODO:
    // The session has the requested AAL already
    // If returnTo in browser state, redirect
  }

  if (id === "session_aal1_required") {
    // TODO:
    //  Multi-factor auth (e.g. 2fa) was requested but the user has no session yet.
    // redirect to login page? (unless already on login page)
  }

  return (
    // Anything else.
    // TODO: log this with sentry?
    <ErrorAlert
      error={error}
      status="error"
      {...errorAlertProps}
      onRetryClick={() => onRestartFlow()}
      {...errorAlertProps}
    />
  );
};
