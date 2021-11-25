import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useRegistrationLocation } from "../hooks/useRegistrationLocation";
import { useSession } from "../hooks/useSession";

export interface RegisterButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const RegisterButton = ({
  children,
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: RegisterButtonProps) => {
  const to = useRegistrationLocation();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={to}
      isDisabled={isDisabled || isUnknown}
    >
      {children || (
        <FormattedMessage
          id="auth.registerButton.content"
          defaultMessage="Sign Up"
        />
      )}
    </Button>
  );
};
