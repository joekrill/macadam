import { Link } from "@chakra-ui/react";
import { UiNodeAnchor } from "../../schemas/flows/ui";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeAnchor;
}

export const SelfServiceUiNodeAnchor = ({
  node,
}: SelfServiceUiNodeInputProps) => (
  <Link href={node.attributes.href}>{node.attributes.title.text}</Link>
);
