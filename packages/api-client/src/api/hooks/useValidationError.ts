import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useMemo } from "react";
import { validationErrorResponseSchema } from "../schemas/response";

export const useValidationError = (
  error?: FetchBaseQueryError | SerializedError,
) =>
  useMemo(() => {
    if (!error || !("data" in error)) {
      return undefined;
    }
    const parsedResult = validationErrorResponseSchema.safeParse(error.data);
    return parsedResult.success ? parsedResult.data.error : undefined;
  }, [error]);
