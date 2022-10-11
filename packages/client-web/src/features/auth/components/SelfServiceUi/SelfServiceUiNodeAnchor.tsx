import { Link } from "@chakra-ui/react";
import { UiNodeAnchor } from "@macadam/api-client";

export interface SelfServiceUiNodeAnchorProps {
  node: UiNodeAnchor;
}

export const SelfServiceUiNodeAnchor = ({
  node,
}: SelfServiceUiNodeAnchorProps) => (
  <Link href={node.attributes.href}>{node.attributes.title.text}</Link>
);
