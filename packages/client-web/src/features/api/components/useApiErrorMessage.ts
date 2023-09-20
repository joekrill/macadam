import { errorResponseSchema } from "@macadam/api-client";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export const useApiErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
) => {
  const { formatMessage } = useIntl();

  return useMemo(() => {
    if ("status" in error) {
      if (error.status === "PARSING_ERROR") {
        return formatMessage(
          {
            id: "api.errors.parsingErrorMessage",
            defaultMessage:
              "Error parsing server response ({error}). Please try again.",
          },
          {
            error: error.error,
            responseText: error.data,
            status: error.status,
          },
        );
      }

      if (error.status === "FETCH_ERROR") {
        return formatMessage(
          {
            id: "api.errors.fetchErrorMessage",
            defaultMessage:
              "Unexpected client error ({error}). Please try again.",
          },
          {
            error: error.error,
          },
        );
      }
    }

    let message: string | undefined;
    let name: string | undefined;
    let code: string | number | undefined;

    if ("status" in error && typeof error.status === "number") {
      code = error.status;
      const errorResponse = errorResponseSchema.safeParse(error.data);
      if (errorResponse.success) {
        message = errorResponse.data.error.message;
        name = errorResponse.data.error.name;
      }
    }

    if (code === undefined && "code" in error) {
      code = error.code;
    }

    if (message === undefined && "message" in error) {
      message = error.message;
    }

    if (name === undefined && "name" in error) {
      message = error.name;
    }

    if (message) {
      return formatMessage(
        {
          id: "api.errors.genericMessageWithMessage",
          defaultMessage: "Error: {message} ({code}/{name}). Please try again.",
        },
        {
          code,
          message,
          name,
        },
      );
    }

    if (code || name) {
      return formatMessage(
        {
          id: "api.errors.genericMessageWithCode",
          defaultMessage:
            "The server returned an unexpected resonse ({code}). Please try again.",
        },
        {
          code: code || name,
        },
      );
    }

    return formatMessage({
      id: "api.errors.genericMessage",
      defaultMessage: "An unknown error occurred. Please try again.",
    });
  }, [error, formatMessage]);
};
