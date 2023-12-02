import { LoginFlow } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";

export interface LoginFormTitleProps {
  flow?: LoginFlow;
}

export const LoginFormTitle = ({ flow }: LoginFormTitleProps) => {
  if (flow?.refresh) {
    return (
      <FormattedMessage
        id="auth.loginForm.confirmAccess.heading"
        description="The heading text displayed at the top of the login form when the user is already logged in but we need them to enter their password again to reconfirm their access"
        defaultMessage="Confirm access"
      />
    );
  }

  if (flow?.requested_aal === "aal2") {
    return (
      <FormattedMessage
        id="auth.loginForm.2fa.heading"
        description="The heading text displayed at the top of the login form when requesting the user's 2FA code"
        defaultMessage="Two-Factor Authentication"
      />
    );
  }

  return (
    <FormattedMessage
      id="auth.loginForm.login.heading"
      description="The heading text displayed at the top of the login form when logging in"
      defaultMessage="Log in to your account"
    />
  );
};
