import { Spinner, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

export interface LoadingSpinnerProps {
  children?: ReactNode;
}

export const LoadingSpinner = ({ children }: LoadingSpinnerProps) => {
  const { formatMessage } = useIntl();
  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <VStack p={6} spacing={6} textAlign="center" justifyContent="center">
      <Spinner
        thickness="5px"
        color="blue.600"
        size="xl"
        label={formatMessage({
          id: "common.loadingSpinner.ariaLabel",
          defaultMessage: "Loading...",
          description:
            "The accessible text to show for the spinning loading indicator",
        })}
      />
      {children && <Text color={textColor}>{children}</Text>}
    </VStack>
  );
};
