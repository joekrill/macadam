import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../hooks/useLoginLocation";
import { useSession } from "../hooks/useSession";

export interface SignUpButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const SignUpButton = ({
  children = "Sign Up",
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: SignUpButtonProps) => {
  const loginLocation = useLoginLocation();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={{
        ...loginLocation,
        pathname: "/auth/registration",
      }}
      isDisabled={isDisabled || isUnknown}
    >
      {children}
    </Button>
  );
};
