import { VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import {
  useSettingsFlow,
  UseSettingsFlowOptions,
} from "../../hooks/useSettingsFlow";
import { FlowError } from "../FlowError";
import { FlowHeading } from "../FlowHeading";
import { FlowLoadingSpinner } from "../FlowLoadingSpinner";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { SettingsForm } from "./SettingsForm";

export interface SettingsProps extends UseSettingsFlowOptions {}

export const Settings = ({ flowId, returnTo }: SettingsProps) => {
  const {
    error,
    flow,
    isInitializing,
    isSubmitting,
    restart,
    restartReason,
    submit,
  } = useSettingsFlow({ flowId, returnTo });

  return (
    <VStack align="stretch" spacing="4">
      <FlowHeading
        title={
          <FormattedMessage
            id="auth.settings.title"
            description="The title displayed at the top of the settings form"
            defaultMessage="Profile Settings"
          />
        }
      />
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowError error={error} onRestartFlow={restart} flowType="login" />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <SettingsForm
          flow={flow}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {isInitializing && <FlowLoadingSpinner />}
    </VStack>
  );
};
