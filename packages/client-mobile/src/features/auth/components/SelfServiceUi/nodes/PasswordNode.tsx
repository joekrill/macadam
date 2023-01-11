import { PasswordInput } from "../../PasswordInput";
import { RecoveryLink } from "../../RecoveryLink";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { NodeFormControlWrapper } from "./NodeFormControlWrapper";

export interface PasswordNodeProps extends SelfServiceUiNodeInputProps {}

export const PasswordNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
}: PasswordNodeProps) => {
  const {
    label,
    node_type: _,
    type: _type,
    onclick,
    ...attributes
  } = node.attributes;
  console.log("PasswordNode", { node });

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
      helperText={flowType === "login" && <RecoveryLink />}
    >
      <PasswordInput
        {...attributes}
        // autoComplete="password"
        flowType={flowType}
        borderColor="gray.400"
        onChangeText={(text) => onChange(text)}
        isDisabled={attributes.disabled || isSubmitting}
        value={value || ""}
      />
    </NodeFormControlWrapper>
  );
};
