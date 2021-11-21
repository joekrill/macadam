import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

export interface HomepageButtonLinkProps extends ButtonProps {}

/**
 * Displays a message letting the user know that they are already logged in,
 * and giving them the option of logging out, as well as proviging a link to the
 * main home page.
 *
 * This is meant to be used in the login page and is shown if the user somehow
 * gets to that page even though they are already logged in.
 */
export const HomepageButton = (props: HomepageButtonLinkProps) => (
  <Button
    as={RouterLink}
    variant="solid"
    colorScheme="blue"
    leftIcon={<Icon as={FaHome} />}
    isTruncated
    {...props}
    to="/"
  >
    <FormattedMessage
      id="auth.hompageButton.label"
      defaultMessage="Go to the homepage"
    />
  </Button>
);
