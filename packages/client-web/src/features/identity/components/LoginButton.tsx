import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export interface LoginButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const LoginButton = ({
  children = "Log In",
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: LoginButtonProps) => {
  const location = useLocation();
  const session = useSession();

  return (
    <Button
      {...props}
      as={RouterLink}
      to={{
        pathname: "/auth/login",
        state: { from: location },
      }}
      isDisabled={isDisabled || session.isLoading}
    >
      {children}
    </Button>
  );
};
