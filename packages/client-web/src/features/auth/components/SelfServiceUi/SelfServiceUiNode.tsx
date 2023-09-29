import { UiNode } from "@macadam/api-client";
import { SelfServiceUiNodeScript } from "./SelfServiceNodeScript";
import { SelfServiceUiNodeAnchor } from "./SelfServiceUiNodeAnchor";
import { SelfServiceUiNodeImage } from "./SelfServiceUiNodeImage";
import { SelfServiceUiNodeInput } from "./SelfServiceUiNodeInput";
import { SelfServiceUiNodeText } from "./SelfServiceUiNodeText";

export interface SelfServiceUiNodeProps<T = unknown> {
  node: UiNode;
  isSubmitting: boolean;
  value?: T;
  onChange: (newValue: T) => void;
  flowType?: string;
}

export const SelfServiceUiNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: SelfServiceUiNodeProps) => {
  switch (node.type) {
    case "input": {
      return (
        <SelfServiceUiNodeInput
          flowType={flowType}
          isSubmitting={isSubmitting}
          node={node}
          // @ts-ignore: TODO
          value={value}
          onChange={onChange}
        />
      );
    }
    case "img": {
      return <SelfServiceUiNodeImage node={node} />;
    }
    case "a": {
      return <SelfServiceUiNodeAnchor node={node} />;
    }
    case "text": {
      return <SelfServiceUiNodeText node={node} />;
    }
    case "script": {
      return <SelfServiceUiNodeScript node={node} />;
    }
    default: {
      return null;
    }
  }
};
