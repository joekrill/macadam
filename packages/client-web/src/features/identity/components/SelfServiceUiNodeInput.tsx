import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { PasswordInput } from "../../common/components/PasswordInput/PasswordInput";
import { UiNodeInput } from "../schemas/flows/ui";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeInput;
  isSubmitting: boolean;
}

/**
 * A mapping of a field's `name` attribute to the desired label.
 * Kratos sents inconsistent labels (if any) for various forms. Until that's
 * fixed or improved, this give us more consistency.
 */
const LABELS: Record<string, string> = {
  password: "Password",

  /**
   * Kratos uses "ID" here (because it's possible to have multiple, so I guess
   * it doesn't distinguish). But we know we always want an email address.
   */
  password_identifier: "E-Mail",

  // The "recovery" flow doesn't provide a label, for some reason.
  email: "E-Mail",
};

export const SelfServiceUiNodeInput = ({
  isSubmitting,
  node,
}: SelfServiceUiNodeInputProps) => {
  const { meta, messages } = node;
  const { label, value, ...attributes } = node.attributes;
  const errors = messages?.filter((message) => message.type === "error") || [];

  switch (attributes.type) {
    case "hidden": {
      return <input {...attributes} value={value} />;
    }
    case "password":
    case "email":
    case "text": {
      const InputComponent =
        attributes.type === "password" ? PasswordInput : Input;
      return (
        <FormControl
          isInvalid={errors.length > 0}
          isRequired={attributes.required}
          isDisabled={attributes.disabled || isSubmitting}
          mb={3}
        >
          <FormLabel>
            {LABELS[attributes.name] ||
              meta?.label?.text ||
              label?.text ||
              attributes.name}
          </FormLabel>
          <InputComponent
            {...attributes}
            borderColor="gray.300"
            defaultValue={value}
            disabled={attributes.disabled || isSubmitting}
          />
          {messages
            ?.filter((message) => message.type === "info")
            .map((message) => (
              <FormHelperText key={message.id}>{message.text}</FormHelperText>
            ))}
          {errors.map((message) => (
            <FormErrorMessage key={message.id}>{message.text}</FormErrorMessage>
          ))}
        </FormControl>
      );
    }
    // TODO: How to handle checkbox
    // case "checkbox": {
    //   return (
    //     <>
    //       <input type="hidden" value="false" name="traits.path.to.my.boolean" />
    //       <input
    //         type="checkbox"
    //         value="true"
    //         name="traits.path.to.my.boolean"
    //       />
    //     </>
    //   );
    // }
    case "submit": {
      return (
        <Button
          {...attributes}
          key="button"
          mt={4}
          colorScheme="blue"
          type="submit"
          isDisabled={attributes.disabled}
          isLoading={isSubmitting}
          value={value}
        >
          {meta?.label?.text || "Submit"}
        </Button>
      );
    }
    default:
      return null;
  }
};
