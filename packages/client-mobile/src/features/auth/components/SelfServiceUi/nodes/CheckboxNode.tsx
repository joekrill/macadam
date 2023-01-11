import { Checkbox } from "native-base";
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
        value={value}
        borderColor="gray.300"
        isChecked={typeof value === "boolean" ? value : false}
        onChange={(e) => onChange(e)}
        isDisabled={attributes.disabled || isSubmitting}
      />
    </NodeFormControlWrapper>
  );
};
