import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useIntl } from "react-intl";
import {
  ErrorAlert,
  ErrorAlertProps,
} from "../../errors/components/ErrorAlert/ErrorAlert";
import { useApiErrorMessage } from "../hooks/useApiErrorMessage";

export interface ApiErrorAlertProps extends ErrorAlertProps {
  error: FetchBaseQueryError | SerializedError;
}

export const ApiErrorAlert = ({ error, ...props }: ApiErrorAlertProps) => {
  const { formatMessage } = useIntl();
  const message = useApiErrorMessage(error);
  return (
    <ErrorAlert
      title={formatMessage({
        id: "errors.apiErrorAlert.message",
        defaultMessage: "Something went wrong",
      })}
      {...props}
    >
      {message}
    </ErrorAlert>
  );
};
