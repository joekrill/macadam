import {
  Button,
  HStack,
  Icon,
  Stack,
  StackProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ReactChild } from "react";
import { FaBell } from "react-icons/fa";
import { Link as RouterLink, To } from "react-router-dom";

export interface NotificationBannerProps extends StackProps {
  linkTo: To;
  linkText: ReactChild;
}

export const NotificationBanner = ({
  linkTo,
  linkText,
  children,
  ...props
}: NotificationBannerProps) => (
  <Stack
    fontSize="sm"
    direction={{ base: "column", sm: "row" }}
    justifyContent="center"
    alignItems="center"
    py="1"
    px={{ base: "3", md: "6", lg: "8" }}
    color={useColorModeValue("blue.900", "white")}
    bg={useColorModeValue("blue.200", "blue.800")}
    {...props}
  >
    <HStack spacing="3">
      <Icon as={FaBell} fontSize="md" h="10" />
      <Text fontWeight="medium" marginEnd="2">
        {children}
      </Text>
    </HStack>
    <Button
      as={RouterLink}
      to={linkTo}
      colorScheme="blue"
      variant="solid"
      size="sm"
      w={{ base: "full", sm: "auto" }}
      flexShrink={0}
    >
      {linkText}
    </Button>
  </Stack>
);
