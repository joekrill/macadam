import { Checkbox } from "@chakra-ui/react";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface CheckboxNodeProps extends SelfServiceUiNodeInputProps {}

export const CheckboxNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: CheckboxNodeProps) => {
  const { label, node_type: _, onclick, ...attributes } = node.attributes;

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
    >
      <Checkbox
        {...attributes}
        borderColor="gray.300"
        isChecked={typeof value === "boolean" ? value : false}
        onChange={(e) => onChange(e.target.checked)}
        isDisabled={attributes.disabled || isSubmitting}
      />
    </NodeFormControlWrapper>
  );
};
