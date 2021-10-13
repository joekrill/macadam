import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../hooks/useLoginLocation";

export interface LoginLinkProps extends LinkProps {}

export const LoginLink = ({
  children = "Log In",
  onClick,
  ...props
}: LoginLinkProps) => {
  const location = useLoginLocation();

  return (
    <Link {...props} as={RouterLink} to={location}>
      {children}
    </Link>
  );
};
