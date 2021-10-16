import { Alert, AlertIcon, AlertProps, Button, Flex } from "@chakra-ui/react";
import { MouseEventHandler } from "react";
import { FormattedMessage } from "react-intl";

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
      <FormattedMessage
        id="errors.errorAlert.message"
        defaultMessage="Something went wrong :("
      />
    </Flex>
    {onRetryClick && (
      <Button colorScheme="red" onClick={onRetryClick}>
        <FormattedMessage
          id="errors.errorAlert.retryButton"
          defaultMessage="Try Again"
        />
      </Button>
    )}
  </Alert>
);
