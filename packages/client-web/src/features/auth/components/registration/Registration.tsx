import { VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useLoginReturnToLocation } from "../../hooks/useLoginReturnToLocation";
import {
  useRegistrationFlow,
  UseRegistrationFlowOptions,
} from "../../hooks/useRegistrationFlow";
import { FlowError } from "../FlowError";
import { FlowHeading } from "../FlowHeading";
import { FlowLoadingSpinner } from "../FlowLoadingSpinner";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { LoginLink } from "../LoginLink";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { RegistrationForm } from "./RegistrationForm";

export interface RegistrationProps extends UseRegistrationFlowOptions {}

export const Registration = ({ flowId, returnTo }: RegistrationProps) => {
  const history = useHistory();
  const returnToState = useLoginReturnToLocation();

  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    isSuccessful,
    restart,
    restartReason,
    submit,
  } = useRegistrationFlow({ flowId, returnTo });

  useEffect(() => {
    if (isSuccessful) {
      history.push(returnTo || returnToState);
    }
  }, [isSuccessful, history, returnTo, returnToState]);

  return (
    <VStack align="stretch" spacing="4">
      <FlowHeading
        title={
          <FormattedMessage
            id="auth.registration.title"
            description="The title displayed at the top of the registration form"
            defaultMessage="Create your account"
          />
        }
        subtitle={
          <FormattedMessage
            id="auth.registration.alreadyHaveAccountLink"
            defaultMessage="Already have an account? {loginLink}"
            values={{
              loginLink: <LoginLink />,
            }}
          />
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowError
          error={error}
          onRestartFlow={restart}
          flowType="registration"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <RegistrationForm
          flow={flow}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {isInitializing && <FlowLoadingSpinner />}
    </VStack>
  );
};
