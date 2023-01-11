import { VStack } from "@chakra-ui/react";
import { useSettingsFlow, UseSettingsFlowOptions } from "@macadam/api-client";
import { LoadingSpinner } from "../../../../common/components/LoadingSpinner/LoadingSpinner";
import { SelfServiceUiMessageList } from "../../SelfServiceUi/SelfServiceUiMessageList";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
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
      {restartReason && <FlowRestartedAlert reason={restartReason} />}
      {error && (
        <FlowErrorAlert
          error={error}
          onRestartFlow={restart}
          flowType="login"
        />
      )}
      <SelfServiceUiMessageList mt={3} messages={flow?.ui?.messages} />
      {flow && (
        <SettingsForm
          flow={flow}
          isSubmitting={isSubmitting}
          onSubmit={submit}
        />
      )}
      {isInitializing && <LoadingSpinner />}
    </VStack>
  );
};
