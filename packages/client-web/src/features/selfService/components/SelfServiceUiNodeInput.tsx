import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { UiNodeInput } from "../types";

export interface SelfServiceUiNodeInputProps {
  node: UiNodeInput;
}

export const SelfServiceUiNodeInput = ({
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
          isDisabled={attributes.disabled}
        >
          <FormLabel>
            {meta?.label?.text || label?.text || defaultLabel}
          </FormLabel>
          <Input {...attributes} defaultValue={value} />
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
      // Since we intercept the button and submit via a `fetch` call,
      // technically the submitter (the button, in this case) should not be
      // included in the form data (Firefox follows the spec, but Chrome
      // and Safari include it anyway). To ensure it's always included,
      // this node will include an additional `hidden` input with that data.
      return (
        <>
          <input key="input" {...attributes} type="hidden" value={value} />
          <Button key="button" mt={4} colorScheme="blue" type="submit">
            {meta?.label.text || "Submit"}
          </Button>
        </>
      );
    }
    default:
      return null;
  }
};
