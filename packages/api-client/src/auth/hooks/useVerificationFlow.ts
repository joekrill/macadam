import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { identityApi, SubmitFlowPayload } from "../identityApi";
import { FlowRestartReason } from "../schemas/errors";
import { InitializeFlowParams } from "../schemas/flows/common";
import { useFlowError } from "./useFlowError";
// import { trackEvent } from "@macadam/client-web/src/features/analytics";

const {
  useSubmitVerificationFlowMutation,
  useInitializeVerificationFlowMutation,
  useGetVerificationFlowQuery,
} = identityApi;

export interface UseVerificationFlowOptions extends InitializeFlowParams {
  flowId?: string;
}

export const useVerificationFlow = ({
  flowId: flowIdProp,
  returnTo,
}: UseVerificationFlowOptions = {}) => {
  const [restartReason, setRestartReason] = useState<
    FlowRestartReason | undefined
  >();
  const [initializeFlow, initializeResult] =
    useInitializeVerificationFlowMutation();
  const flowId = initializeResult.data?.id || flowIdProp;
  const [submitFlow, submitResult] = useSubmitVerificationFlowMutation();
  const getFlow = useGetVerificationFlowQuery(flowId ?? skipToken);
  const flow = getFlow.data || initializeResult.data;
  const error = initializeResult.error || getFlow.error || submitResult.error;
  const parsedError = useFlowError(error);
  const isSuccessful = submitResult.data?.state === "passed_challenge";

  const restart = useCallback(
    (reason?: FlowRestartReason) => {
      submitResult.reset();
      initializeFlow({ returnTo });
      setRestartReason(reason);
    },
    [initializeFlow, setRestartReason, submitResult, returnTo]
  );

  const submit = useCallback(
    (payload: SubmitFlowPayload) => {
      submitFlow(payload);
      setRestartReason(undefined);
    },
    [submitFlow, setRestartReason]
  );

  useEffect(() => {
    if (!flowId) {
      initializeFlow({ returnTo });
    }
  }, [initializeFlow, flowId, returnTo]);

  // useEffect(() => {
  //   if (isSuccessful) {
  //     trackEvent("Verification: Success");
  //   }
  // }, [isSuccessful]);

  // useEffect(() => {
  //   if (error) {
  //     trackEvent("Verification: Failure");
  //   }
  // }, [error]);

  return {
    error,
    errorId: parsedError.id,
    flow,
    submit,
    restart,
    restartReason,
    isSuccessful,
    isInitializing: initializeResult.isLoading,
    isSubmitting: submitResult.isLoading,
  };
};
