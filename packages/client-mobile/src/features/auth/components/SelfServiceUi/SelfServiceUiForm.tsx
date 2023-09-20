// import { Stack, StackProps } from "@chakra-ui/react";
import {
  SubmitFlowPayload,
  UiContainer,
  UiNode,
  useNodeGroup,
} from "@macadam/api-client";
import { IStackProps, Stack } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiFormProps extends Omit<IStackProps, "onSubmit"> {
  group?: string;
  ui: UiContainer;
  onSubmit: (payload: SubmitFlowPayload) => void;
  isSubmitting?: boolean;
  flowType?: string;
}

const valuesFromNodes = (nodes: UiNode[]): Record<string, any> =>
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
      const data = {} as Record<string, any>;

      Object.keys(values).forEach((key) => {
        data[key] = values[key] || "";
      });

      Object.keys(additionalValues).forEach((key) => {
        data[key] = additionalValues[key] || "";
      });

      // @ts-ignore TODO: fix this
      onSubmit({ action, method, body: data });
    },
    [action, method, values, onSubmit],
  );

  return (
    // <form
    //   action={action}
    //   method={method}
    //   onSubmit={(e) => {
    //     e.preventDefault();
    //     submitForm ();
    //   }}
    // >
    <Stack alignItems="start" space="md" direction="column" {...props}>
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
    // </form>
  );
};
