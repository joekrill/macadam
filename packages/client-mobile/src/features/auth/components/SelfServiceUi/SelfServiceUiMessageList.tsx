import { UiText } from "@macadam/api-client";
import { Box, IBoxProps } from "native-base";
import { SelfServiceUiMessage } from "./SelfServiceUiMessage";

export interface SelfServiceMessageListProps extends IBoxProps {
  messages?: UiText[] | null;
}

export const SelfServiceUiMessageList = ({
  messages,
  ...boxProps
}: SelfServiceMessageListProps) => {
  if (!messages || messages.length === 0) {
    return null;
  }

  return (
    <Box {...boxProps}>
      {messages?.map((message: UiText) => (
        <SelfServiceUiMessage key={message.id} message={message} />
      ))}
    </Box>
  );
};
