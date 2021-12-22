import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Button,
  ButtonProps,
  Flex,
} from "@chakra-ui/react";
import { MouseEventHandler, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { captureException } from "../../../monitoring/capture";

export interface ErrorAlertProps extends AlertProps {
  onRetryClick?: MouseEventHandler<HTMLButtonElement>;
  disableCapture?: boolean;
  error?: any;
}

const BUTTON_SCHEME: Record<
  Exclude<AlertProps["status"], undefined>,
  ButtonProps["colorScheme"]
> = {
  error: "red",
  info: "blue",
  warning: "yellow",
  success: "green",
};

export const ErrorAlert = ({
  children,
  onRetryClick,
  error,
  disableCapture = false,
  status = "error",
  title,
  ...alertProps
}: ErrorAlertProps) => {
  useEffect(() => {
    if (!disableCapture && error) {
      captureException(error);
    }
  }, [disableCapture, error]);

  return (
    <Alert
      status={status}
      display="flex"
      justifyContent="space-between"
      {...alertProps}
    >
      <AlertIcon boxSize="2.5em" alignSelf="flex-start" mr="3" />
      <Flex flex="1" flexDirection="column">
        {title && <AlertTitle mb="2">{title}</AlertTitle>}
        <AlertDescription>
          {children || (
            <FormattedMessage
              id="errors.errorAlert.message"
              defaultMessage="Something went wrong :("
            />
          )}
        </AlertDescription>
      </Flex>
      {onRetryClick && (
        <Button
          alignSelf="flex-start"
          ml="3"
          colorScheme={BUTTON_SCHEME[status]}
          onClick={onRetryClick}
        >
          <FormattedMessage
            id="errors.errorAlert.retryButton.label"
            defaultMessage="Try Again"
          />
        </Button>
      )}
    </Alert>
  );
};
