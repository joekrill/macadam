import { Box, BoxProps } from "@chakra-ui/react";
import { UiText } from "../schemas/ui";
import { SelfServiceUiMessage } from "./SelfServiceUiMessage";

export interface SelfServiceMessageListProps extends BoxProps {
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
