import {
  FlowRestartReason,
  identityApi,
  InitializeFlowParams,
  isRegistrationFlowSuccess,
  SubmitFlowPayload,
} from "@macadam/api-client";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "../../../../analytics";
import { useFlowError } from "../useFlowError";

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
  const isSuccessful = isRegistrationFlowSuccess(submitResult.data);

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

  useEffect(() => {
    if (isSuccessful) {
      trackEvent("Signup");
    }
  }, [isSuccessful]);

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
