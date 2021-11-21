import { Text } from "@chakra-ui/react";
import { UiNodeText } from "../../schemas/flows/ui";

export interface SelfServiceUiNodeTextProps {
  node: UiNodeText;
}

export const SelfServiceUiNodeText = ({ node }: SelfServiceUiNodeTextProps) => (
  <Text>{node.attributes.text.text}</Text>
);
