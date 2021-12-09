import { VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Navigate } from "react-router-dom";
import {
  useVerificationFlow,
  UseVerificationFlowOptions,
} from "../hooks/useVerificationFlow";
import { FlowError } from "./FlowError";
import { FlowHeading } from "./FlowHeading";
import { FlowLoadingSpinner } from "./FlowLoadingSpinner";
import { FlowRestartedAlert } from "./FlowRestartedAlert";
import { HomepageButton } from "./HomepageButton";
import { SelfServiceUiForm } from "./SelfServiceUi/SelfServiceUiForm";
import { SelfServiceUiMessageList } from "./SelfServiceUi/SelfServiceUiMessageList";

export interface VerificationProps extends UseVerificationFlowOptions {}

export const Verification = ({ flowId, returnTo }: VerificationProps) => {
  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    isSuccessful,
    restart,
    restartReason,
    submit,
  } = useVerificationFlow({ flowId, returnTo });

  return (
    <VStack align="stretch" spacing="4">
      {isSuccessful && returnTo && <Navigate to={returnTo} />}
      <FlowHeading
        title={
          <FormattedMessage
            id="auth.verification.title"
            description="The title displayed at the top of the verification form"
            defaultMessage="Verify your account"
          />
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowError
          error={error}
          onRestartFlow={restart}
          flowType="verification"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow?.state === "choose_method" && (
        <SelfServiceUiForm
          ui={flow.ui}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {(flow?.state === "passed_challenge" || flow?.state === "sent_email") && (
        <HomepageButton />
      )}
      {(isInitializing || isSubmitting) && <FlowLoadingSpinner />}
    </VStack>
  );
};
