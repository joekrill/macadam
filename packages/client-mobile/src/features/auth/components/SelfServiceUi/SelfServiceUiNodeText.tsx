import { UiNodeText } from "@macadam/api-client";
import { Text } from "native-base";

export interface SelfServiceUiNodeTextProps {
  node: UiNodeText;
}

export const SelfServiceUiNodeText = ({ node }: SelfServiceUiNodeTextProps) => (
  <Text>{node.attributes.text.text}</Text>
);
