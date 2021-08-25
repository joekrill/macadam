import { identityApi } from "../identityApi";
import {
  isSelfServiceRegistrationFlow,
  isSelfServiceRegistrationFlowSuccess,
} from "../schemas/flows/registration";

export const useRegistrationFlow = () => {
  const registrationFlowQuery =
    identityApi.useInitializeRegistrationFlowQuery();
  const [submitRegistration, result] =
    identityApi.useSubmitRegistrationFlowMutation();
  const isSuccess = isSelfServiceRegistrationFlowSuccess(result.data);

  if (isSuccess) {
    // TODO: Handle successful registration.
  }

  return {
    // When we initialize the flow it includes the `ui`. After submitting,
    // we are eitehr succesfully logged in, or we are given an updated `ui`
    // which contains error messages, etc.
    ui: isSelfServiceRegistrationFlow(result?.data)
      ? result.data.ui
      : registrationFlowQuery.data?.ui,
    submit: submitRegistration,
    restart: registrationFlowQuery.refetch,
    isLoading: registrationFlowQuery.isLoading,
    error: registrationFlowQuery.error,
    isSubmitting: result.isLoading,
    isSuccess,
  };
};
