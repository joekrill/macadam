import { FormattedMessage } from "react-intl";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "../../errors/components/ErrorAlert/ErrorAlert";

export interface ThingLoadErrorProps {
  error: ErrorAlertProps["error"];
  refetch?: ErrorAlertProps["onRetryClick"];
}

export const ThingLoadError = ({ error, refetch }: ThingLoadErrorProps) => {
  const isNotFound =
    error === 404 ||
    (error && "originalStatus" in error && error.originalStatus === 404);
  return (
    <ErrorAlert
      my="5"
      onRetryClick={isNotFound ? undefined : refetch}
      disableCapture={isNotFound}
      error={error}
    >
      {isNotFound && (
        <FormattedMessage
          id="things.thingLoadError.notFound"
          defaultMessage="The Thing you are looking for couldn't be found."
        />
      )}
    </ErrorAlert>
  );
};
