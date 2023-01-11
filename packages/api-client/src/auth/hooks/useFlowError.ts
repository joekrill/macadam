import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useMemo } from "react";
import {
  flowErrorSchema,
  isFlowRedirectError,
  isFlowRestartError,
} from "../schemas/errors";

export const useFlowError = (error?: FetchBaseQueryError | SerializedError) => {
  const flowError = useMemo(() => {
    if (error && "data" in error) {
      try {
        return flowErrorSchema.parse(error.data);
      } catch (_) {}
    }

    return undefined;
  }, [error]);

  const id = flowError?.error.id;
  const originalStatus =
    error &&
    "originalStatus" in error &&
    typeof error.originalStatus === "number"
      ? error.originalStatus
      : undefined;
  const statusCode =
    originalStatus ||
    (error && "status" in error && typeof error.status === "number"
      ? error.status
      : undefined);

  return {
    id,
    flowError: flowError?.error,
    redirectTo: flowError?.redirect_browser_to,
    isRedirectToError: isFlowRedirectError(id),
    isRestartError: isFlowRestartError(id),
    statusCode,
  };
};
