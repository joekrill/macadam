import { Text } from "@chakra-ui/react";
import { UiNodeText } from "@macadam/api-client";

export interface SelfServiceUiNodeTextProps {
  node: UiNodeText;
}

export const SelfServiceUiNodeText = ({ node }: SelfServiceUiNodeTextProps) => (
  <Text>{node.attributes.text.text}</Text>
);
