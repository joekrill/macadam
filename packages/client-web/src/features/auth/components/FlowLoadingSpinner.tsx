import { Spinner, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface FlowLoadingSpinnerProps {
  children?: ReactNode;
}

export const FlowLoadingSpinner = ({ children }: FlowLoadingSpinnerProps) => (
  <VStack p={6} spacing={6} textAlign="center" justifyContent="center">
    <Spinner thickness="5px" color="blue.600" size="xl" />
    <Text color={useColorModeValue("gray.500", "gray.400")}>{children}</Text>
  </VStack>
);
