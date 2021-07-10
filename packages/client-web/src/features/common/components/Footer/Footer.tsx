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
    <Stack spacing="10" divider={<StackDivider />}>
      <Stack
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
        direction={{ base: "column-reverse", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} {process.env.REACT_APP_DISPLAY_NAME}
          . All rights reserved.
        </Text>
      </Stack>
    </Stack>
  </Box>
);
