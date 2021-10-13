import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../hooks/useLoginLocation";
import { useSession } from "../hooks/useSession";

export interface LoginButtonProps extends ButtonProps {}

export const LoginButton = ({
  children = "Log In",
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
      {children}
    </Button>
  );
};
