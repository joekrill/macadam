import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { identityApi, SubmitFlowPayload } from "../identityApi";
import { FlowRestartReason } from "../schemas/errors";
import { InitializeFlowParams } from "../schemas/flows/common";
import { isRegistrationFlowSuccess } from "../schemas/flows/registration";
import { useFlowError } from "./useFlowError";

const {
  useSubmitRegistrationFlowMutation,
  useInitializeRegistrationFlowMutation,
  useGetRegistrationFlowQuery,
} = identityApi;

export interface UseRegistrationFlowOptions extends InitializeFlowParams {
  flowId?: string;
}

export const useRegistrationFlow = ({
  flowId: flowIdProp,
  returnTo,
}: UseRegistrationFlowOptions = {}) => {
  const [restartReason, setRestartReason] = useState<
    FlowRestartReason | undefined
  >();
  const [initializeFlow, initializeResult] =
    useInitializeRegistrationFlowMutation();
  const flowId = initializeResult.data?.id || flowIdProp;
  const [submitFlow, submitResult] = useSubmitRegistrationFlowMutation();
  const getFlow = useGetRegistrationFlowQuery(flowId ?? skipToken);
  const flow = getFlow.data || initializeResult.data;
  const error = initializeResult.error || getFlow.error || submitResult.error;
  const parsedError = useFlowError(error);

  const restart = useCallback(
    (reason?: FlowRestartReason) => {
      // TODO: abort() any in-flight request?
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
    isSuccessful: isRegistrationFlowSuccess(submitResult.data),
    isInitializing: initializeResult.isLoading,
    isSubmitting: submitResult.isLoading,
  };
};
