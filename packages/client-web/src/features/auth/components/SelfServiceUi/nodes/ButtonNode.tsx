import { Button, ButtonProps } from "@chakra-ui/react";
import { UiNodeButtonInput } from "@macadam/api-client";
import { SelfServiceUiNodeInputProps } from "../SelfServiceUiNodeInput";
import { useNodeLabel } from "./useNodeLabel";

export interface ButtonNodeProps
  extends SelfServiceUiNodeInputProps,
    Omit<ButtonProps, "onChange" | "value"> {
  node: UiNodeButtonInput;
}

export const ButtonNode = ({
  flowType,
  isSubmitting,
  node,
  onChange,
  value,
  ...props
}: ButtonNodeProps) => {
  const {
    label: _label,
    node_type: _,
    onclick,
    ...attributes
  } = node.attributes;
  const label = useNodeLabel(node);

  return (
    <Button
      {...attributes}
      colorScheme="blue"
      isDisabled={attributes.disabled}
      isLoading={isSubmitting}
      value={value || ""}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        // If this is a Webauthn button, an onclick will be provided
        if (onclick) {
          const run = new Function(onclick); // eslint-disable-line no-new-func
          run();
        }

        onChange(attributes.value);
      }}
      {...props}
    >
      {label}
    </Button>
  );
};
