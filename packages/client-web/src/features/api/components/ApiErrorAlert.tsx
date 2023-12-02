import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useIntl } from "react-intl";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "../../errors/components/ErrorAlert/ErrorAlert";
import { useApiErrorMessage } from "./useApiErrorMessage";

export interface ApiErrorAlertProps extends ErrorAlertProps {
  error: FetchBaseQueryError | SerializedError;
}

export const ApiErrorAlert = ({ error, ...props }: ApiErrorAlertProps) => {
  const { formatMessage } = useIntl();
  const message = useApiErrorMessage(error);
  return (
    <ErrorAlert
      title={formatMessage({
        id: "api.error.generic.heading",
        description:
          "The error message displayed when an API request fails for an unknown reason and an error message was provided by the server.",
        defaultMessage: "Something went wrong",
      })}
      {...props}
    >
      {message}
    </ErrorAlert>
  );
};
