import { VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "../../../../common/components/LoadingSpinner/LoadingSpinner";
import { useReturnToConsumer } from "../../../../routing/hooks/useReturnToConsumer";
import { LOGIN_PATH } from "../../../hooks/useLoginLocation";
import { REGISTRATION_PATH } from "../../../hooks/useRegistrationLocation";
import { LoginLink } from "../../LoginLink/LoginLink";
import { SelfServiceUiMessageList } from "../../SelfServiceUi/SelfServiceUiMessageList";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { RegistrationForm } from "./RegistrationForm";
import {
  useRegistrationFlow,
  UseRegistrationFlowOptions,
} from "./useRegistrationFlow";

export interface RegistrationProps extends UseRegistrationFlowOptions {}

export const Registration = ({
  flowId,
  returnTo: returnToProp,
}: RegistrationProps) => {
  const returnTo =
    useReturnToConsumer({
      preferred: returnToProp,
      forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    }) || "/";

  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    isSuccessful,
    restart,
    restartReason,
    submit,
  } = useRegistrationFlow({ flowId, returnTo: returnToProp });

  return (
    <VStack align="stretch" spacing="4">
      {isSuccessful && <Navigate to={returnTo || "/"} />}
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
        <FlowErrorAlert
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
      {isInitializing && <LoadingSpinner />}
    </VStack>
  );
};
