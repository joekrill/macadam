import { UiNode } from "../schemas/flows/ui";
import { SelfServiceUiNodeInput } from "./SelfServiceUiNodeInput";

export interface SelfServiceUiNodeProps {
  node: UiNode;
  isSubmitting: boolean;
}

export const SelfServiceUiNode = ({
  isSubmitting,
  node,
}: SelfServiceUiNodeProps) => {
  switch (node.type) {
    case "input": {
      return <SelfServiceUiNodeInput isSubmitting={isSubmitting} node={node} />;
    }
    // TODO: "anchor", "text", and "image" types
    default: {
      return null;
    }
  }
};
