import { Button, ButtonProps } from "@chakra-ui/react";
import { useSession } from "@macadam/api-client";
import { Link as RouterLink } from "react-router-dom";
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
