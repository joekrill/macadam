import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../hooks/useLoginLocation";
import { useSession } from "../hooks/useSession";

export interface LoginButtonProps extends ButtonProps {}

export const LoginButton = ({
  children,
  onClick,
  isDisabled,
  ...props
}: LoginButtonProps) => {
  const loginLocation = useLoginLocation();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={loginLocation}
      isDisabled={isDisabled || isUnknown}
    >
      {children || (
        <FormattedMessage id="auth.loginButton.label" defaultMessage="Log In" />
      )}
    </Button>
  );
};
