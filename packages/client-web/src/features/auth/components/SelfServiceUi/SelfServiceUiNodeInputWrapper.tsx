import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { UiNodeInput } from "../../schemas/flows/ui";
import { RecoveryLink } from "../RecoveryLink/RecoveryLink";
import { LABEL_MAPPINGS } from "./labelMappings";

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
  const { meta, messages } = node;
  const { label, node_type: _, onclick, ...attributes } = node.attributes;
  const errors = messages?.filter((message) => message.type === "error") || [];

  return (
    <FormControl
      isInvalid={errors.length > 0}
      isRequired={attributes.required}
      isDisabled={attributes.disabled || isSubmitting}
    >
      <FormLabel>
        {LABEL_MAPPINGS[attributes.name] ||
          meta?.label?.text ||
          label?.text ||
          attributes.name}
      </FormLabel>
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
