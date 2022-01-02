import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { UiNodeInput } from "../../schemas/flows/ui";
import { RecoveryLink } from "../RecoveryLink/RecoveryLink";
import { useNodeLabel } from "./useNodeLabel";

export interface SelfServiceUiNodeInputWrapperProps {
  node: UiNodeInput;
  isSubmitting: boolean;
  flowType?: string;

  children: React.ReactChild;
}

export const SelfServiceUiNodeInputWrapper = ({
  children,
  flowType,
  isSubmitting,
  node,
}: SelfServiceUiNodeInputWrapperProps) => {
  const { messages } = node;
  const { node_type: _, onclick, ...attributes } = node.attributes;
  const errors = messages?.filter((message) => message.type === "error") || [];
  const label = useNodeLabel(node);

  return (
    <FormControl
      isInvalid={errors.length > 0}
      isRequired={attributes.required}
      isDisabled={attributes.disabled || isSubmitting}
    >
      <FormLabel>{label}</FormLabel>
      {children}
      {messages
        ?.filter((message) => message.type === "info")
        .map((message) => (
          <FormHelperText key={message.id}>{message.text}</FormHelperText>
        ))}
      {errors.map((message) => (
        <FormErrorMessage key={message.id}>{message.text}</FormErrorMessage>
      ))}
      {flowType === "login" && attributes.type === "password" && (
        <FormHelperText key="forgot-password">
          <RecoveryLink />
        </FormHelperText>
      )}
    </FormControl>
  );
};
