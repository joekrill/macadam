import { identityApi, useSessionToken } from "@macadam/api-client";
import { Button, IButtonProps, Text } from "native-base";
import React from "react";
import { FormattedMessage } from "react-intl";

export const LogoutButtonLabel = () => (
  <Text>
    <FormattedMessage id="auth.logoutButton.label" defaultMessage="Log Out" />
  </Text>
);

export interface LogoutButtonProps extends IButtonProps {
  onLogoutComplete?: () => void;
}

export const LogoutButton = ({
  children,
  onLogoutComplete,
  ...props
}: LogoutButtonProps) => {
  const [logout, data] = identityApi.useLogoutNativeMutation();
  const sessionToken = useSessionToken();

  return (
    <Button
      {...props}
      disabled={!sessionToken}
      onPress={() => logout(sessionToken!)}
      isLoading={data.isLoading}
    >
      {children || <LogoutButtonLabel />}
    </Button>
  );
};
