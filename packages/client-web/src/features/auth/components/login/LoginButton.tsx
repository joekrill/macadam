import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../../hooks/useLoginLocation";
import { useSession } from "../../hooks/useSession";
import { LoginLinkLabel } from "./LoginLink";

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
      {...loginLocation}
      as={RouterLink}
      isDisabled={isDisabled || isUnknown}
    >
      {children || <LoginLinkLabel />}
    </Button>
  );
};
