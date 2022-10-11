import { Button, ButtonProps } from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";
import { Link as RouterLink } from "react-router-dom";
import { useRegistrationLink } from "./useRegistrationLink";

export interface RegistrationLinkButtonProps extends ButtonProps {
  onLogoutComplete?: () => void;
}

export const RegistrationLinkButton = ({
  children,
  onClick,
  onLogoutComplete,
  isDisabled,
  ...props
}: RegistrationLinkButtonProps) => {
  const { to, state, label } = useRegistrationLink();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      aria-label={label}
      as={RouterLink}
      to={to}
      state={state}
      isDisabled={isDisabled || isUnknown}
    >
      {children || label}
    </Button>
  );
};
