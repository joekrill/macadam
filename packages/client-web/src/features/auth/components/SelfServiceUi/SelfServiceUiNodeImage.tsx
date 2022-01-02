import { Image } from "@chakra-ui/react";
import { UiNodeImage } from "../../schemas/flows/ui";

export interface SelfServiceUiNodeImageProps {
  node: UiNodeImage;
}

export const SelfServiceUiNodeImage = ({
  node,
}: SelfServiceUiNodeImageProps) => (
  <Image src={node.attributes.src} alt={node.meta.label?.text} />
);
