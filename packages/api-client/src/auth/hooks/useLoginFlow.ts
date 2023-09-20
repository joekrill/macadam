import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect, useState } from "react";
import { identityApi, SubmitFlowPayload } from "../identityApi";
import { FlowRestartReason } from "../schemas/errors";
import {
  InitializeLoginFlowParams,
  isLoginFlowSuccess,
} from "../schemas/flows/login";
import { useFlowError } from "./useFlowError";
// import { trackEvent } from "../../../../analytics";

const {
  useSubmitLoginFlowMutation,
  useInitializeLoginFlowMutation,
  useGetLoginFlowQuery,
} = identityApi;

export interface UseLoginFlowOptions extends InitializeLoginFlowParams {
  flowId?: string;
}

export const useLoginFlow = ({
  flowId: flowIdProp,
  aal,
  refresh,
  returnTo,
  clientType,
}: UseLoginFlowOptions = {}) => {
  const [restartReason, setRestartReason] = useState<
    FlowRestartReason | undefined
  >();
  const [initializeFlow, initializeResult] = useInitializeLoginFlowMutation();
  const flowId = initializeResult.data?.id || flowIdProp;
  const [submitFlow, submitResult] = useSubmitLoginFlowMutation();
  const getFlow = useGetLoginFlowQuery(flowId ?? skipToken);
  const flow = getFlow.data || initializeResult.data;
  const error = initializeResult.error || getFlow.error || submitResult.error;
  const parsedError = useFlowError(error);

  const restart = useCallback(
    (reason?: FlowRestartReason) => {
      submitResult.reset();
      initializeFlow({ aal, refresh, returnTo, clientType });
      setRestartReason(reason);
    },
    [
      initializeFlow,
      setRestartReason,
      submitResult,
      aal,
      refresh,
      returnTo,
      clientType,
    ],
  );

  const submit = useCallback(
    (payload: SubmitFlowPayload) => {
      submitFlow(payload);
      setRestartReason(undefined);
    },
    [submitFlow, setRestartReason],
  );

  useEffect(() => {
    if (!flowId) {
      initializeFlow({ aal, refresh, returnTo });
    }
  }, [initializeFlow, flowId, aal, refresh, returnTo]);

  // TODO: Find a way to add back tracking here.
  // useEffect(() => {
  //   if (isSuccessful) {
  //     trackEvent("Login");
  //   }
  // }, [isSuccessful]);

  return {
    error,
    errorId: parsedError.id,
    flow,
    submit,
    restart,
    restartReason,
    isSuccessful: isLoginFlowSuccess(submitResult.data),
    isInitializing: initializeResult.isLoading,
    isSubmitting: submitResult.isLoading,
  };
};
