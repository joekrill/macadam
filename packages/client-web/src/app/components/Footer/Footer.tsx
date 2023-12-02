import {
  Box,
  BoxProps,
  Flex,
  Heading,
  Icon,
  Stack,
  StackDivider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaRegGem } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { ActiveLocaleSelect } from "../../../features/i18n/components/ActiveLocaleSelect/ActiveLocaleSelect";
import { ColorModeSwitcher } from "../../../features/theme/components/ColorModeSwitcher/ColorModeSwitcher";
import { FooterLinkGrid } from "./FooterLinkGrid";
import { FooterSocialMediaLinks } from "./FooterSocialMediaLinks";

export interface FooterProps extends BoxProps {}

/**
 * Adapted from {@link https://pro.chakra-ui.com/components/marketing/footers#footer-with-two-columns}
 */
export const Footer = (props: FooterProps) => (
  <Box
    as="footer"
    role="contentinfo"
    width="full"
    bg={useColorModeValue("white", "gray.700")}
    py="12"
    px={{ base: "4", md: "8" }}
    {...props}
  >
    <Stack mx="auto" maxW="container.lg" spacing="8" divider={<StackDivider />}>
      <Stack
        as="nav"
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "8", lg: "28" }}
        alignItems="center"
      >
        <Stack flex="1" direction="column">
          <Heading fontSize="xl" display="flex" mb={2} alignItems="center">
            <Icon as={FaRegGem} fontSize="2xl" mr={2} />{" "}
            {process.env.VITE_DISPLAY_NAME}
          </Heading>
          <FooterSocialMediaLinks />
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "10", md: "20" }}
        >
          <FooterLinkGrid
            spacing={{ base: "10", md: "20", lg: "28" }}
            flex="1"
          />
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
            id="footer.copyrightNotice"
            description="The copyright notice displayed in the footer."
            defaultMessage="© {now, date, ::yyyy} {appName}. All rights reserved."
            values={{
              now: new Date(),
              appName: process.env.VITE_DISPLAY_NAME,
            }}
          />
        </Text>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          direction={{ base: "row", md: "row-reverse" }}
        >
          <ActiveLocaleSelect size="sm" width="unset" mx="1" />
          <ColorModeSwitcher variant="ghost" color="current" mx="1" />
        </Flex>
      </Stack>
    </Stack>
  </Box>
);
