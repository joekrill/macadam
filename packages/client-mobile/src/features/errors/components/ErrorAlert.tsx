import Ionicons from "@expo/vector-icons/Ionicons";
import { ensure as ensureError } from "errorish";
import {
  Alert,
  Button,
  HStack,
  IAlertProps,
  IButtonProps,
  Icon,
  Text,
  VStack,
} from "native-base";
import { useMemo } from "react";
// import { HiRefresh } from "react-icons/hi";
// import { FormattedMessage } from "react-intl";
// import { captureException } from "../../../monitoring/capture";

export interface ErrorAlertProps extends IAlertProps {
  onRetryClick?: () => void;
  disableCapture?: boolean;
  error?: any;
  title?: string;
}

const BUTTON_SCHEME: Record<
  Exclude<IAlertProps["status"], undefined>,
  IButtonProps["colorScheme"]
> = {
  error: "red",
  info: "blue",
  warning: "yellow",
  success: "green",
  loading: "gray",
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
  // useEffect(() => {
  //   if (!disableCapture && error) {
  //     captureException(error);
  //   }
  // }, [disableCapture, error]);

  const coercedError = useMemo(() => ensureError(error), [error]);

  return (
    <Alert
      status={status}
      display="flex"
      justifyContent="space-between"
      {...alertProps}
    >
      <VStack alignItems="flex-start" space="4">
        <HStack alignItems="center" space="1">
          {/* <Alert.Icon boxSize="md" /> */}
          <Text fontSize="xl">
            {String(title) || "Something went wrong :("}
            {/* {title || (
              <FormattedMessage
                id="errors.errorAlert.message"
                defaultMessage="Something went wrong :("
              />
            )} */}
          </Text>
        </HStack>
        <Text fontSize="md">{children || coercedError.message}</Text>
        {onRetryClick && (
          <Button
            colorScheme={BUTTON_SCHEME[status]}
            onPress={onRetryClick}
            variant="outline"
            size="sm"
            leftIcon={<Icon as={<Ionicons name="refresh" size={5} />} />}
          >
            Try Again
            {/* <FormattedMessage
              id="errors.errorAlert.retryButton.label"
              defaultMessage="Try Again"
            /> */}
          </Button>
        )}
      </VStack>
    </Alert>
  );
};
