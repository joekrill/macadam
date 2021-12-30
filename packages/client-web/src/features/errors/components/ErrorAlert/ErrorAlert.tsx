import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertProps,
  AlertTitle,
  Button,
  ButtonProps,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ensure as ensureError } from "errorish";
import { MouseEventHandler, useEffect, useMemo } from "react";
import { HiRefresh } from "react-icons/hi";
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

  const coercedError = useMemo(() => ensureError(error), [error]);

  return (
    <Alert
      status={status}
      display="flex"
      justifyContent="space-between"
      {...alertProps}
    >
      <VStack alignItems="flex-start" spacing="4">
        <HStack alignItems="center" spacing="1">
          <AlertIcon boxSize="2em" />
          <AlertTitle fontSize="xl">
            {title || (
              <FormattedMessage
                id="errors.errorAlert.message"
                defaultMessage="Something went wrong :("
              />
            )}
          </AlertTitle>
        </HStack>
        <AlertDescription>
          {children || (
            <Text wordBreak="break-all">{coercedError.message}</Text>
          )}
        </AlertDescription>
        {onRetryClick && (
          <Button
            colorScheme={BUTTON_SCHEME[status]}
            onClick={onRetryClick}
            variant="outline"
            size="sm"
            leftIcon={<HiRefresh />}
          >
            <FormattedMessage
              id="errors.errorAlert.retryButton.label"
              defaultMessage="Try Again"
            />
          </Button>
        )}
      </VStack>
    </Alert>
  );
};
