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
      <Flex>
        <AlertIcon />
        {title && <AlertTitle>{title}</AlertTitle>}
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
        <Button colorScheme={BUTTON_SCHEME[status]} onClick={onRetryClick}>
          <FormattedMessage
            id="errors.errorAlert.retryButton"
            defaultMessage="Try Again"
          />
        </Button>
      )}
    </Alert>
  );
};
