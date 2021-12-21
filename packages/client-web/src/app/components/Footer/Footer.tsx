import {
  Box,
  BoxProps,
  Heading,
  Icon,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { FaRegGem } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { LocaleSelect } from "../../../features/i18n/components/LocaleSelect";
import { LinkGrid } from "./LinkGrid";
import { SocialMediaLinks } from "./SocialMediaLinks";

export interface FooterProps extends BoxProps {}

/**
 * Adapted from {@link https://pro.chakra-ui.com/components/marketing/footers#footer-with-two-columns}
 */
export const Footer = (props: FooterProps) => (
  <Box
    as="footer"
    role="contentinfo"
    mx="auto"
    maxW="container.lg"
    py="12"
    px={{ base: "4", md: "8" }}
    {...props}
  >
    <Stack spacing="8" divider={<StackDivider />}>
      <Stack
        as="nav"
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "10", lg: "28" }}
      >
        <Stack flex="1" direction="column">
          <Heading fontSize="xl" display="flex" mb={2} alignItems="center">
            <Icon as={FaRegGem} fontSize="2xl" mr={2} />{" "}
            {process.env.REACT_APP_DISPLAY_NAME}
          </Heading>
          <SocialMediaLinks />
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "10", md: "20" }}
        >
          <LinkGrid spacing={{ base: "10", md: "20", lg: "28" }} flex="1" />
        </Stack>
      </Stack>
      <Stack
        as="nav"
        direction={{ base: "column-reverse", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
        spacing="6"
      >
        <Text fontSize="sm" flex="1">
          <FormattedMessage
            id="app.footer.copyrightNotice"
            defaultMessage="© {now, date, ::yyyy} {appName}. All rights reserved."
            values={{
              now: new Date(),
              appName: process.env.REACT_APP_DISPLAY_NAME,
            }}
          />
        </Text>
        <LocaleSelect size="sm" width="unset" />
      </Stack>
    </Stack>
  </Box>
);
