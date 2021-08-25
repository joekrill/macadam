import { useCallback, useState } from "react";
import { identityApi } from "../identityApi";
import { SelfServiceFlowName } from "../schemas/flows";

export interface UseFlowOptions {
  flowName: SelfServiceFlowName;
}

export interface SubmitPayload {
  data: FormData;
  method: string;
  action: string;
}

export const useFlow = ({ flowName }: UseFlowOptions) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { refetch, data } = identityApi.useInitializeFlowQuery(flowName, {
    //   skip: isLoggedIn !== false, // Don't initialize the query unless we have determined we aren't logged in already.
  });
  const [submitFlow, submitResult] = identityApi.useSubmitFlowMutation();
  const id = "id" in data && typeof data.id === "string" && data.id;

  /**
   * Resets the form to an initial state, reinitializing the flow and ignoring
   * any previously submission.
   */
  const reset = useCallback(() => {
    refetch();
    setIsSubmitted(false);
  }, [refetch, setIsSubmitted]);

  const submit = useCallback(
    ({ action, method, data }: SubmitPayload) => {
      if (id) {
        submitFlow({
          id,
          action,
          method,
          body: Object.fromEntries(data),
        });
        setIsSubmitted(true);
      }
    },
    [id, submitFlow, setIsSubmitted]
  );

  return {
    reset,
    submit,
    data: (isSubmitted ? submitResult.data : undefined) || data,
  };
};
