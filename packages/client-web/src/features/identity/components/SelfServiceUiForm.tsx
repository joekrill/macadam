import { useRef } from "react";
import { UiContainer, UiNodeInput } from "../schemas/ui";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiFormProps {
  ui: UiContainer;
  onSubmit: (onSubmitParams: {
    action: string;
    method: string;
    data: FormData;
  }) => void;
  isSubmitting?: boolean;
}
export const SelfServiceUiForm = ({
  isSubmitting = false,
  ui,
  onSubmit,
}: SelfServiceUiFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={ui.action}
      method={ui.method}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current || undefined);

        // Kratos expects that the submit button value will also be sent when
        // the form is posted -- but technically the `FormData` spec indicates
        // the submitter (the button, in this case), should not be included
        // in the form data (Firefox follows the spec, but Chrome
        // and Safari include it anyway). And in many cases kratos expects
        // it -- especially in cases where a form has multiple "methods"
        // (the setting flow, for example, can inlcude multiple buttons on
        // the form with different effects, i.e.: "profile", "password", "oidc")
        // Hopefully this becomes unncessary when the introduce JSON responses
        // for browser flows (https://github.com/ory/kratos/issues/1138).
        // In the meantime we need to figure out the submitter and include
        // it manually here:

        // @ts-ignore
        const submitter = e.nativeEvent.submitter as
          | HTMLFormElement
          | undefined;

        if (submitter) {
          // Ideally we just use `submitter`, but this isn't universally
          // suported (looking at you, Safari).
          formData.set(submitter.name, submitter.value);
        } else if (document.activeElement?.matches("input[type='submit']")) {
          // If the active element is a submit button, it was what triggered
          // the form submission.
          const { name, value } = document.activeElement as HTMLInputElement;
          formData.set(name, value);
        } else if (document.activeElement?.matches("input")) {
          // Otherwise, find the underlying node for the activeElement,
          // determine which "group" ir belongs to, then find the submit button
          // that belongs to _that_ group.
          const { name } = document.activeElement as HTMLInputElement;
          const activeNode = ui.nodes.find(
            // @ts-ignore
            (node) => node.attributes.name === name
          );
          const submitter =
            activeNode &&
            (ui.nodes.find(
              (node) =>
                node.group === activeNode.group &&
                node.type === "input" &&
                node.attributes.type === "submit"
            ) as UiNodeInput | undefined);
          if (submitter?.attributes.value) {
            formData.set(submitter.attributes.name, submitter.attributes.value);
          }
        }

        onSubmit({
          action: ui.action,
          method: ui.method,
          data: formData,
        });
      }}
    >
      {ui.nodes.map((node, index) => (
        <SelfServiceUiNode
          key={index}
          node={node}
          isSubmitting={isSubmitting}
        />
      ))}
    </form>
  );
};
