import { Spinner, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface LoadingSpinnerProps {
  children?: ReactNode;
}

export const LoadingSpinner = ({ children }: LoadingSpinnerProps) => {
  const textColor = useColorModeValue("gray.500", "gray.400");
  return (
    <VStack p={6} spacing={6} textAlign="center" justifyContent="center">
      <Spinner thickness="5px" color="blue.600" size="xl" />
      {children && <Text color={textColor}>{children}</Text>}
    </VStack>
  );
};
