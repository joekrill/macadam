import { Alert, AlertIcon, AlertProps, Button, Flex } from "@chakra-ui/react";

export interface FlowErrorProps extends AlertProps {
  onRetry?: () => void;
}

export const FlowError = ({ onRetry, ...props }: FlowErrorProps) => (
  <Alert
    status="error"
    mt={4}
    displa="flex"
    justifyContent="space-between"
    {...props}
  >
    <Flex>
      <AlertIcon />
      Hmmmm... something went wrong. :(
    </Flex>
    {onRetry && (
      <Button colorScheme="red" onClick={() => onRetry()}>
        Try again
      </Button>
    )}
  </Alert>
);
