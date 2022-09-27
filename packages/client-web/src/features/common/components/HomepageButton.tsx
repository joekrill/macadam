import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { FaHome } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

export interface HomepageButtonLinkProps extends ButtonProps {}

/**
 * A link button that goes to the home page.
 */
export const HomepageButton = (props: HomepageButtonLinkProps) => (
  <Button
    as={RouterLink}
    variant="solid"
    colorScheme="blue"
    leftIcon={<Icon as={FaHome} />}
    noOfLines={1}
    {...props}
    to="/"
  >
    <FormattedMessage
      id="common.hompageButton.label"
      defaultMessage="Go to the homepage"
    />
  </Button>
);
