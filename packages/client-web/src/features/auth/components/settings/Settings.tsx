import { TypographyProps, VStack } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { LoadingSpinner } from "../../../common/components/LoadingSpinner/LoadingSpinner";
import {
  useSettingsFlow,
  UseSettingsFlowOptions,
} from "../../hooks/useSettingsFlow";
import { FlowErrorAlert } from "../FlowErrorAlert";
import { FlowHeading } from "../FlowHeading";
import { FlowRestartedAlert } from "../FlowRestartedAlert";
import { SelfServiceUiMessageList } from "../SelfServiceUi/SelfServiceUiMessageList";
import { SettingsForm } from "./SettingsForm";

export interface SettingsProps extends UseSettingsFlowOptions {
  headingTextAlign?: TypographyProps["textAlign"];
}

export const Settings = ({
  flowId,
  headingTextAlign,
  returnTo,
}: SettingsProps) => {
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
        textAlign={headingTextAlign}
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
