import { Input } from "@chakra-ui/react";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface TextInputNodeProps extends SelfServiceUiNodeInputProps {
  value?: string;
}

export const TextInputNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: TextInputNodeProps) => {
  const { label, node_type: _, onclick, ...attributes } = node.attributes;

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
    >
      <Input
        {...attributes}
        borderColor="gray.400"
        onChange={(e) => onChange(e.target.value)}
        isDisabled={attributes.disabled || isSubmitting}
        value={value || ""}
      />
    </NodeFormControlWrapper>
  );
};
