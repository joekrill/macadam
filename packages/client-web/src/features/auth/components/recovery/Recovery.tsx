import { VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { Navigate } from "react-router-dom";
import { HomepageButton } from "../../../common/components/HomepageButton";
import { LoadingSpinner } from "../../../common/components/LoadingSpinner/LoadingSpinner";
import {
  useRecoveryFlow,
  UseRecoveryFlowOptions,
} from "../../hooks/useRecoveryFlow";
import { FlowError } from "../FlowError";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiForm } from "../SelfServiceUi/SelfServiceUiForm";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";

export interface RecoveryProps extends UseRecoveryFlowOptions {}

export const Recovery = ({ flowId, returnTo }: RecoveryProps) => {
  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    isSuccessful,
    restart,
    restartReason,
    submit,
  } = useRecoveryFlow({ flowId, returnTo });

  return (
    <VStack align="stretch" spacing="4">
      {isSuccessful && returnTo && <Navigate to={returnTo} />}
      <FlowHeading
        title={
          <FormattedMessage
            id="auth.recovery.title"
            description="The title displayed at the top of the recovery form"
            defaultMessage="Recover your account"
          />
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowError error={error} onRestartFlow={restart} flowType="recovery" />
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
      {(isInitializing || isSubmitting) && <LoadingSpinner />}
    </VStack>
  );
};
