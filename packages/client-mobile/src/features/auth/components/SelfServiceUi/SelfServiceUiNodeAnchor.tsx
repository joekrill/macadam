import { UiNodeAnchor } from "@macadam/api-client";
import { Link } from "native-base";

export interface SelfServiceUiNodeAnchorProps {
  node: UiNodeAnchor;
}

export const SelfServiceUiNodeAnchor = ({
  node,
}: SelfServiceUiNodeAnchorProps) => (
  <Link href={node.attributes.href}>{node.attributes.title.text}</Link>
);
