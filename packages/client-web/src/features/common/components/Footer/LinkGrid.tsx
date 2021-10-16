import {
  Box,
  Link,
  SimpleGrid,
  SimpleGridProps,
  Stack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { FooterHeading } from "./FooterHeading";

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid
    columns={process.env.NODE_ENV === "development" ? 3 : 2}
    {...props}
  >
    <Box minW="130px">
      <FooterHeading mb="4">
        <FormattedMessage
          id="app.footer.linkGroups.resources.header"
          defaultMessage="Resources"
        />
      </FooterHeading>
      <Stack>
        <Link as={RouterLink} to="/faq">
          <FormattedMessage
            id="app.footer.links.faq.label"
            defaultMessage="FAQ"
          />
        </Link>
        <Link as={RouterLink} to="/contact">
          <FormattedMessage
            id="app.footer.links.contact.label"
            defaultMessage="Contact"
          />
        </Link>
      </Stack>
    </Box>
    <Box minW="130px">
      <FooterHeading mb="4">
        <FormattedMessage
          id="app.footer.linkGroups.legal.header"
          defaultMessage="Legal"
        />
      </FooterHeading>
      <Stack>
        <Link as={RouterLink} to="/privacy">
          <FormattedMessage
            id="app.footer.links.privacy.label"
            defaultMessage="Privacy"
          />
        </Link>
        <Link as={RouterLink} to="/terms">
          <FormattedMessage
            id="app.footer.links.termsAndConditions.label"
            defaultMessage="Terms"
          />
        </Link>
      </Stack>
    </Box>
    {process.env.NODE_ENV === "development" && (
      <Box minW="130px">
        <FooterHeading mb="4">Testing</FooterHeading>
        <Stack>
          <Link as={RouterLink} to="/crash">
            Crash test
          </Link>
          <Link as={RouterLink} to="/user/profile">
            Protected route
          </Link>
        </Stack>
      </Box>
    )}
  </SimpleGrid>
);
