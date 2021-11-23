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
import { MouseEventHandler } from "react";
import { FormattedMessage } from "react-intl";

export interface ErrorAlertProps extends AlertProps {
  onRetryClick?: MouseEventHandler<HTMLButtonElement>;
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
  status = "error",
  title,
  ...alertProps
}: ErrorAlertProps) => (
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
