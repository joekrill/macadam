import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useCallback, useEffect, useState } from "react";
import { identityApi, SubmitFlowPayload } from "../identityApi";
import { FlowRestartReason } from "../schemas/errors";
import { InitializeFlowParams } from "../schemas/flows/common";
import { useFlowError } from "./useFlowError";

const {
  useSubmitSettingsFlowMutation,
  useInitializeSettingsFlowMutation,
  useGetSettingsFlowQuery,
} = identityApi;

export interface UseSettingsFlowOptions extends InitializeFlowParams {
  flowId?: string;
}

export const useSettingsFlow = ({
  flowId: flowIdProp,
  returnTo,
}: UseSettingsFlowOptions = {}) => {
  const [restartReason, setRestartReason] = useState<
    FlowRestartReason | undefined
  >();
  const [initializeFlow, initializeResult] =
    useInitializeSettingsFlowMutation();
  const flowId = initializeResult.data?.id || flowIdProp;
  const [submitFlow, submitResult] = useSubmitSettingsFlowMutation();
  const getFlow = useGetSettingsFlowQuery(flowId ?? skipToken);
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
    isSuccessful: submitResult.isSuccess,
    isInitializing: initializeResult.isLoading,
    isSubmitting: submitResult.isLoading,
  };
};
