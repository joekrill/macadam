import { LoginFlow } from "@macadam/api-client";
import { Text } from "native-base";
// import { FormattedMessage } from "react-intl";

export interface LoginFormTitleProps {
  flow?: LoginFlow;
}

export const LoginFormTitle = ({ flow }: LoginFormTitleProps) => {
  if (flow?.refresh) {
    return <Text>Confirm Access</Text>;
    // return (
    //   <FormattedMessage
    //     id="auth.loginFormTitle.confirmAccess"
    //     description="The title displayed at the top of the login form when the user is already logged in but we need them to enter their password again to reconfirm their access"
    //     defaultMessage="Confirm access"
    //   />
    // );
  }

  if (flow?.requested_aal === "aal2") {
    return <Text>Two-Factor Authentication</Text>;
    // return (
    //   <FormattedMessage
    //     id="auth.loginFormTitle.2fa"
    //     description="The title displayed at the top of the login form when requesting the user's 2FA code"
    //     defaultMessage="Two-Factor Authentication"
    //   />
    // );
  }
  return <Text>Log in to your account</Text>;
  // return (
  //   <FormattedMessage
  //     id="auth.loginFormTitle.login"
  //     description="The title displayed at the top of the login form when logging in"
  //     defaultMessage="Log in to your account"
  //   />
  // );
};
