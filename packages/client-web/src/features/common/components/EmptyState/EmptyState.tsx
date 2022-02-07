import { Box, ButtonGroup, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons/lib";

export interface EmptyStateProps {
  message?: React.ReactNode;
  children?: React.ReactNode;
  icon?: IconType;
}

export const EmptyState = ({ message, children, icon }: EmptyStateProps) => (
  <Box as="section">
    <Box
      maxW="2xl"
      mx="auto"
      px={{ base: "6", lg: "8" }}
      py={{ base: "16", sm: "20" }}
      textAlign="center"
    >
      {icon && <Icon as={icon} boxSize="2em" />}
      <Text my="4" fontSize="lg">
        {message}
      </Text>
      <ButtonGroup size="sm" colorScheme="blue" fontWeight="bold">
        {children}
      </ButtonGroup>
    </Box>
  </Box>
);
