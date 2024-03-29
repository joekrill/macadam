import { Stack, StackProps } from "@chakra-ui/react";
import {
  SubmitFlowPayload,
  UiContainer,
  UiNode,
  useNodeGroup,
} from "@macadam/api-client";
import { useCallback, useEffect, useState } from "react";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiFormProps extends Omit<StackProps, "onSubmit"> {
  group?: string;
  ui: UiContainer;
  onSubmit: (payload: SubmitFlowPayload) => void;
  isSubmitting?: boolean;
  flowType?: string;
}

const valuesFromNodes = (nodes: UiNode[]): Record<string, unknown> =>
  nodes.reduce((values, node) => {
    if (node.type !== "input") {
      return values;
    }

    if (
      node.attributes.type ===
      "submit" /* || node.attributes.type === "button" */
    ) {
      return values;
    }

    return {
      ...values,
      [node.attributes.name]: node.attributes.value,
    };
  }, {});

export const SelfServiceUiForm = ({
  flowType,
  group,
  isSubmitting = false,
  ui,
  onSubmit,
  ...props
}: SelfServiceUiFormProps) => {
  const { action, method } = ui;
  const nodes = useNodeGroup(ui.nodes, group);

  const [values, setValues] = useState(valuesFromNodes(nodes));

  // Whenever the nodes are updated, we can reset our underlying form values.
  // This usually occurs after a form is submitted.
  useEffect(() => {
    setValues(valuesFromNodes(nodes));
  }, [nodes, setValues]);

  const submitForm = useCallback(
    (additionalValues: Record<string, string> = {}) => {
      const data = new FormData();

      Object.keys(values).forEach((key) => {
        // @ts-ignore: TODO
        data.set(key, values[key] || "");
      });

      Object.keys(additionalValues).forEach((key) => {
        data.set(key, additionalValues[key] || "");
      });

      onSubmit({ action, method, body: Object.fromEntries(data) });
    },
    [action, method, values, onSubmit],
  );

  return (
    <form
      action={action}
      method={method}
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
    >
      <Stack align="start" spacing={5} direction="column" {...props}>
        {nodes.map((node, index) => (
          <SelfServiceUiNode
            flowType={flowType}
            key={index}
            node={node}
            isSubmitting={isSubmitting}
            onChange={(newValue) => {
              if (node.type !== "input") {
                return;
              }

              if (node.attributes.type === "submit") {
                // @ts-ignore: TODO
                submitForm({ [node.attributes.name]: newValue });
              } else {
                setValues((currentValues) => ({
                  ...currentValues,
                  [node.attributes.name]: newValue,
                }));
              }
            }}
            value={
              node.type === "input"
                ? values[node.attributes.name] || ""
                : undefined
            }
          />
        ))}
      </Stack>
    </form>
  );
};
