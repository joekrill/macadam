import { VStack } from "@chakra-ui/react";
import {
  useVerificationFlow,
  UseVerificationFlowOptions,
} from "@macadam/api-client";
import { FormattedMessage } from "react-intl";
import { Navigate } from "react-router-dom";
import { HomepageButton } from "../../../../common/components/HomepageButton";
import { LoadingSpinner } from "../../../../common/components/LoadingSpinner/LoadingSpinner";
import { SelfServiceUiForm } from "../../SelfServiceUi/SelfServiceUiForm";
import { SelfServiceUiMessageList } from "../../SelfServiceUi/SelfServiceUiMessageList";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";

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
        <FlowErrorAlert
          error={error}
          onRestartFlow={restart}
          flowType="verification"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {(flow?.state === "choose_method" || flow?.state === "sent_email") && (
        <SelfServiceUiForm
          ui={flow.ui}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {flow?.state === "passed_challenge" && <HomepageButton />}
      {(isInitializing || isSubmitting) && <LoadingSpinner />}
    </VStack>
  );
};
