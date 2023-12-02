import {
  Box,
  Link,
  SimpleGrid,
  SimpleGridProps,
  Stack,
} from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { FooterLinkGroupHeading } from "./FooterLinkGroupHeading";

export const FooterLinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid
    columns={process.env.NODE_ENV === "development" ? 3 : 2}
    {...props}
  >
    <Box minW="130px">
      <FooterLinkGroupHeading mb="4">
        <FormattedMessage
          id="footer.linkGroup.resources.heading"
          description="The heading text for the 'Resources' group of footer links"
          defaultMessage="Resources"
        />
      </FooterLinkGroupHeading>
      <Stack>
        <Link as={RouterLink} to="/faq">
          <FormattedMessage
            id="footer.links.faq.text"
            description="The text for the link in the footer to the 'FAQ' page"
            defaultMessage="FAQ"
          />
        </Link>
        <Link as={RouterLink} to="/contact">
          <FormattedMessage
            id="footer.links.contactUs.text"
            description="The text for the link in the footer to the 'Contact Us' page"
            defaultMessage="Contact"
          />
        </Link>
      </Stack>
    </Box>
    <Box minW="130px">
      <FooterLinkGroupHeading mb="4">
        <FormattedMessage
          id="footer.linkGroup.legal.heading"
          description="The heading text for the 'Legal' group of footer links"
          defaultMessage="Legal"
        />
      </FooterLinkGroupHeading>
      <Stack>
        <Link as={RouterLink} to="/privacy">
          <FormattedMessage
            id="footer.links.privacyPolicy.text"
            description="The text for the link in the footer to the privacy policy page"
            defaultMessage="Privacy"
          />
        </Link>
        <Link as={RouterLink} to="/terms">
          <FormattedMessage
            id="footer.links.termsAndConditions.text"
            description="The text for the link in the footer to the Term & Conditions page"
            defaultMessage="Terms"
          />
        </Link>
      </Stack>
    </Box>
    {process.env.NODE_ENV === "development" && (
      <Box minW="130px">
        <FooterLinkGroupHeading mb="4">Testing</FooterLinkGroupHeading>
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
