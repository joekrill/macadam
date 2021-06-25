import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { UiNodeInput } from "../identityTypes";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeInput;
  isSubmitting: boolean;
}

export const SelfServiceUiNodeInput = ({
  isSubmitting,
  node,
}: SelfServiceUiNodeInputProps) => {
  const { meta, messages } = node;
  const { label, value, ...attributes } = node.attributes;

  switch (attributes.type) {
    case "hidden": {
      return <input {...attributes} value={value} />;
    }
    case "password":
    case "email":
    case "text": {
      const defaultLabel =
        attributes.type === "password" ? "Password" : attributes.name;

      return (
        <FormControl
          isRequired={attributes.required}
          isDisabled={attributes.disabled || isSubmitting}
        >
          <FormLabel>
            {meta?.label?.text || label?.text || defaultLabel}
          </FormLabel>
          <Input
            {...attributes}
            bg="white"
            borderColor="gray.300"
            defaultValue={value}
            disabled={attributes.disabled || isSubmitting}
          />
          {messages
            ?.filter((message) => message.type === "info")
            .map((message) => (
              <FormHelperText key={message.id}>{message.text}</FormHelperText>
            ))}
          {messages
            ?.filter((message) => message.type === "error")
            .map((message) => (
              <FormErrorMessage key={message.id}>
                {message.text}
              </FormErrorMessage>
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
          {meta?.label.text || "Submit"}
        </Button>
      );
    }
    default:
      return null;
  }
};
