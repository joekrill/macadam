import { UiNode } from "../identityTypes";
import { SelfServiceUiNodeInput } from "./SelfServiceUiNodeInput";

export interface SelfServiceUiNodeProps {
  node: UiNode;
}

export const SelfServiceUiNode = ({ node }: SelfServiceUiNodeProps) => {
  switch (node.type) {
    case "input": {
      return <SelfServiceUiNodeInput node={node} />;
    }
    // TODO: "anchor", "text", and "image" types
    default: {
      return null;
    }
  }
};
