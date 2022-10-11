import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { UiNodeInput } from "@macadam/api-client";
import { useNodeLabel } from "./useNodeLabel";

export interface NodeFormControlWrapperProps {
  node: UiNodeInput;
  isSubmitting: boolean;
  flowType?: string;
  children: React.ReactNode;
  helperText?: React.ReactNode;
}

export const NodeFormControlWrapper = ({
  children,
  flowType,
  helperText,
  isSubmitting,
  node,
}: NodeFormControlWrapperProps) => {
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
      {helperText && (
        <FormHelperText key="helperText-prop">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};
