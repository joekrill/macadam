import { Link, LinkProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { useLoginLocation } from "../../hooks/useLoginLocation";

export const LoginLinkLabel = () => (
  <FormattedMessage id="auth.loginLink.label" defaultMessage="Log In" />
);

export interface LoginLinkProps extends LinkProps {}

export const LoginLink = ({ children, onClick, ...props }: LoginLinkProps) => {
  const location = useLoginLocation();

  return (
    <Link {...props} {...location} as={RouterLink}>
      {children || <LoginLinkLabel />}
    </Link>
  );
};
