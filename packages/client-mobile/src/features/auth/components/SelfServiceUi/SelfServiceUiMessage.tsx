import { UiText } from "@macadam/api-client";
import { Alert, IAlertProps, Text } from "native-base";

export interface SelfServiceUiMessageProps {
  message: UiText;
}

/**
 * The `type` field is not documented explicitly beyond "string", but the type
 * seems to be defined here: {@link https://github.com/ory/kratos/blob/master/text/type.go}
 * as "error" and "info".
 *
 * This map ensures Alert is always passed a valid `status`, even if those values
 * change in the future, and has "forward-compatability" in case kratos
 * adds "warning" and "success" messages.
 */
const STATUS_MAP: Record<string, IAlertProps["status"]> = {
  error: "error",
  info: "info",
  warning: "warning",
  success: "success",
};

export const SelfServiceUiMessage = ({
  message,
}: SelfServiceUiMessageProps) => (
  <Alert status={STATUS_MAP[message.type] || "info"}>
    <Alert.Icon />
    <Text>{message.text}</Text>
  </Alert>
);
