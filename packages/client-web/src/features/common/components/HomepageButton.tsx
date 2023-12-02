import { Button, ButtonProps, chakra, Icon } from "@chakra-ui/react";
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
    {...props}
    to="/"
  >
    <chakra.span noOfLines={1}>
      <FormattedMessage
        id="common.hompageButton.text"
        description="The text to display on the button used to direct the user to the home page"
        defaultMessage="Go to the homepage"
      />
    </chakra.span>
  </Button>
);
