import { UiNodeImage } from "@macadam/api-client";
import { Image } from "native-base";

export interface SelfServiceUiNodeImageProps {
  node: UiNodeImage;
}

export const SelfServiceUiNodeImage = ({
  node,
}: SelfServiceUiNodeImageProps) => (
  <Image source={{ uri: node.attributes.src }} alt={node.meta.label?.text} />
);
