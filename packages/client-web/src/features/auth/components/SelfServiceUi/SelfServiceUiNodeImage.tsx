import { Image } from "@chakra-ui/react";
import { UiNodeImage } from "../../schemas/flows/ui";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeImage;
}

export const SelfServiceUiNodeImage = ({
  node,
}: SelfServiceUiNodeInputProps) => (
  <Image src={node.attributes.src} alt={node.meta.label?.text} />
);
