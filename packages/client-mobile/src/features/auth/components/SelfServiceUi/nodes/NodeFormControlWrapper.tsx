// import {
//   FormControl,
//   FormErrorMessage,
//   FormHelperText,
//   FormLabel,
// } from "@chakra-ui/react";
import { UiNodeInput } from "@macadam/api-client";
import { FormControl } from "native-base";
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
      <FormControl.Label>{label}</FormControl.Label>
      {children}
      {messages
        ?.filter((message) => message.type === "info")
        .map((message) => (
          <FormControl.HelperText key={message.id}>
            {message.text}
          </FormControl.HelperText>
        ))}
      {errors.map((message) => (
        <FormControl.ErrorMessage key={message.id}>
          {message.text}
        </FormControl.ErrorMessage>
      ))}
      {helperText && (
        <FormControl.HelperText key="helperText-prop">
          {helperText}
        </FormControl.HelperText>
      )}
    </FormControl>
  );
};
