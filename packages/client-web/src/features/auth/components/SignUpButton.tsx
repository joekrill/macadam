import { Button, ButtonProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useLoginReturnToLocation } from "../hooks/useLoginReturnToLocation";
import { useSession } from "../hooks/useSession";

export interface SignUpButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const SignUpButton = ({
  children,
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: SignUpButtonProps) => {
  const returnTo = useLoginReturnToLocation();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={{
        pathname: "/auth/registration",
        state: { returnTo },
      }}
      isDisabled={isDisabled || isUnknown}
    >
      {children || (
        <FormattedMessage
          id="auth.signUpButton.label"
          defaultMessage="Sign Up"
        />
      )}
    </Button>
  );
};
