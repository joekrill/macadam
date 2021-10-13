import { Alert, AlertIcon, AlertProps, Button, Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";

export interface ErrorAlertProps extends AlertProps {
  onRetryClick?: MouseEventHandler<HTMLButtonElement>;
}

export const ErrorAlert = ({
  onRetryClick,
  ...alertProps
}: ErrorAlertProps) => (
  <Alert
    status="error"
    display="flex"
    justifyContent="space-between"
    {...alertProps}
  >
    <Flex>
      <AlertIcon />
      Something went wrong :(
    </Flex>
    {onRetryClick && (
      <Button colorScheme="red" onClick={onRetryClick}>
        Try Again
      </Button>
    )}
  </Alert>
);
