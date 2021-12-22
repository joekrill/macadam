import { Link, LinkProps } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

export interface RecoveryLinkProps extends Omit<LinkProps, "as" | "to"> {}

export const RecoveryLink = ({ children, ...props }: RecoveryLinkProps) => (
  <Link as={RouterLink} to="/account/recovery" {...props}>
    {children || (
      <FormattedMessage
        id="auth.recoveryLink.label"
        description="The text displayed for a link that takes you to the account recovery page"
        defaultMessage="Forgot your password?"
      />
    )}
  </Link>
);
