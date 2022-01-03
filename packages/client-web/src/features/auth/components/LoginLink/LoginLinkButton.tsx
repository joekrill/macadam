import { Button, ButtonProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useSession } from "../../hooks/useSession";
import { useLoginLink } from "./useLoginLink";

export interface LoginButtonProps extends ButtonProps {}

export const LoginButton = ({
  children,
  onClick,
  isDisabled,
  ...props
}: LoginButtonProps) => {
  const { label, ...location } = useLoginLink();
  const { isUnknown } = useSession();

  return (
    <Button
      {...props}
      {...location}
      aria-label={label}
      as={RouterLink}
      isDisabled={isDisabled || isUnknown}
    >
      {children || label}
    </Button>
  );
};
