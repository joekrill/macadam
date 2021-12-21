import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useRegistrationLocation } from "../../hooks/useRegistrationLocation";
import { useSession } from "../../hooks/useSession";

export interface RegistrationButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const RegistrationButton = ({
  children,
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: RegistrationButtonProps) => {
  const { to, state } = useRegistrationLocation();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={to}
      state={state}
      isDisabled={isDisabled || isUnknown}
    >
      {children || (
        <FormattedMessage
          id="auth.registrationButton.content"
          defaultMessage="Sign Up"
        />
      )}
    </Button>
  );
};
