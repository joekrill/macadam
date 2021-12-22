import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRegistrationLocation } from "../../hooks/useRegistrationLocation";
import { useSession } from "../../hooks/useSession";
import { RegistrationLinkLabel } from "./RegistrationLink";

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
      {children || <RegistrationLinkLabel />}
    </Button>
  );
};
