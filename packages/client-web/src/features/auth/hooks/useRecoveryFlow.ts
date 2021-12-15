import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { identityApi, SubmitFlowPayload } from "../identityApi";
import { FlowRestartReason } from "../schemas/errors";
import { InitializeFlowParams } from "../schemas/flows/common";
import { useFlowError } from "./useFlowError";

const {
  useSubmitRecoveryFlowMutation,
  useInitializeRecoveryFlowMutation,
  useGetRecoveryFlowQuery,
} = identityApi;

export interface UseRecoveryFlowOptions extends InitializeFlowParams {
  flowId?: string;
}

export const useRecoveryFlow = ({
  flowId: flowIdProp,
  returnTo,
}: UseRecoveryFlowOptions = {}) => {
  const [restartReason, setRestartReason] = useState<
    FlowRestartReason | undefined
  >();
  const [initializeFlow, initializeResult] =
    useInitializeRecoveryFlowMutation();
  const flowId = initializeResult.data?.id || flowIdProp;
  const [submitFlow, submitResult] = useSubmitRecoveryFlowMutation();
  const getFlow = useGetRecoveryFlowQuery(flowId ?? skipToken);
  const flow = getFlow.data || initializeResult.data;
  const error = initializeResult.error || getFlow.error || submitResult.error;
  const parsedError = useFlowError(error);

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

  return {
    error,
    errorId: parsedError.id,
    flow,
    submit,
    restart,
    restartReason,
    isSuccessful: submitResult.data?.state === "passed_challenge",
    isInitializing: initializeResult.isLoading,
    isSubmitting: submitResult.isLoading,
  };
};
