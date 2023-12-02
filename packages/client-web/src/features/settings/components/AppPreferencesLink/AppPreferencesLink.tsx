import { Link, LinkProps } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAppPreferencesLink } from "./useAppPreferencesLink";

export interface AppPreferencesLinkProps extends LinkProps {}

export const AppPreferencesLink = ({
  children,
  onClick,
  ...props
}: AppPreferencesLinkProps) => {
  const { to, text } = useAppPreferencesLink();

  return (
    <Link {...props} to={to} as={RouterLink}>
      {children || text}
    </Link>
  );
};
