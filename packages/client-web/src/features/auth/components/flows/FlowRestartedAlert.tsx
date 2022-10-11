import { Alert, AlertIcon, Text } from "@chakra-ui/react";
import { FlowRestartReason } from "@macadam/api-client";
import { FormattedMessage } from "react-intl";

export interface FlowRestartedAlertProps {
  reason: FlowRestartReason;
}

export const FlowRestartedAlert = ({ reason }: FlowRestartedAlertProps) => (
  <Alert status="error" variant="subtle">
    <AlertIcon />
    <Text>
      <FormattedMessage
        id="auth.flowRestarted.message"
        description="The message telling the user that the form they submitted had to be reloaded"
        defaultMessage="The form had to be reloaded{reason, select, security_csrf_violation { because the security token expired.} security_identity_mismatch { because your session changed} self_service_flow_expired { because the form expired} self_service_flow_return_to_forbidden { because the return URL is invalid} other {}}. Please try again."
        values={{ reason }}
      />
    </Text>
  </Alert>
);
