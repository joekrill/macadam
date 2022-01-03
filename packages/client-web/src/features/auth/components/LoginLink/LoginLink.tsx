import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLink } from "./useLoginLink";

export interface LoginLinkProps extends LinkProps {}

export const LoginLink = ({ children, onClick, ...props }: LoginLinkProps) => {
  const { label, ...location } = useLoginLink();

  return (
    <Link {...props} {...location} as={RouterLink} aria-label={label}>
      {children || label}
    </Link>
  );
};
