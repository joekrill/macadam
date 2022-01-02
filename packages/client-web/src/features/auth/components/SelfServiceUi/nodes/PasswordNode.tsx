import { PasswordInput } from "../../PasswordInput/PasswordInput";
import { RecoveryLink } from "../../RecoveryLink/RecoveryLink";
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
  const { label, node_type: _, onclick, ...attributes } = node.attributes;

  return (
    <NodeFormControlWrapper
      flowType={flowType}
      isSubmitting={isSubmitting}
      node={node}
      helperText={flowType === "login" && <RecoveryLink />}
    >
      <PasswordInput
        {...attributes}
        borderColor="gray.400"
        onChange={(e) => onChange(e.target.value)}
        isDisabled={attributes.disabled || isSubmitting}
        value={value || ""}
      />
    </NodeFormControlWrapper>
  );
};
