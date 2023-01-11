import { Input } from "native-base";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface TextInputNodeProps extends SelfServiceUiNodeInputProps {}

export const TextInputNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: TextInputNodeProps) => {
  const {
    label,
    node_type: _,
    onclick,
    type: _type,
    ...attributes
  } = node.attributes;

  console.log("TextInputNode", { node });

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
    >
      <Input
        {...attributes}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCapitalize="none"
        // type="text"
        borderColor="gray.400"
        onChangeText={(text) => onChange(text)}
        isDisabled={attributes.disabled || isSubmitting}
        value={value || ""}
      />
    </NodeFormControlWrapper>
  );
};
