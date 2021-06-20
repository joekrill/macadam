import {
  Box,
  Link,
  SimpleGrid,
  SimpleGridProps,
  Stack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FooterHeading } from "./FooterHeading";

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={2} {...props}>
    <Box minW="130px">
      <FooterHeading mb="4">Product</FooterHeading>
      <Stack>
        <Link as={RouterLink} to="/how">
          How it works
        </Link>
        <Link as={RouterLink} to="/pricing">
          Pricing
        </Link>
        <Link as={RouterLink} to="/contact">
          Contact
        </Link>
      </Stack>
    </Box>
    <Box minW="130px">
      <FooterHeading mb="4">Resources</FooterHeading>
      <Stack>
        <Link as={RouterLink} to="/privacy">
          Privacy
        </Link>
        <Link as={RouterLink} to="/terms">
          Terms
        </Link>
        <Link as={RouterLink} to="/faq">
          FAQ
        </Link>
      </Stack>
    </Box>
  </SimpleGrid>
);
