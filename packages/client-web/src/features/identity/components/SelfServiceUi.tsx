import { Box, Spinner } from "@chakra-ui/react";
import { useRef } from "react";
import { identityApi, useWhoamiQuery } from "../identityApi";
import { SelfServiceFlowType, UiNodeInput } from "../identityTypes";
import { SelfServiceUiMessage } from "./SelfServiceMessage";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiProps {
  flowId?: string;
  flowType: SelfServiceFlowType;
}

export const SelfServiceUi = ({ flowId, flowType }: SelfServiceUiProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const whoami = useWhoamiQuery();
  const flowQuery = identityApi.useGetFlowQuery(
    { type: flowType, id: flowId || "" },
    {
      skip: !flowId,
    }
  );
  const [submitFlow, submitFlowResult] = identityApi.useSubmitFlowMutation();

  const ui = flowQuery.data?.ui;

  // TODO: It may actually be better to break up the UI into multiple <forms />
  // based on each node's `group` (and including the "default" group nodes in
  // every form). Each group can have a distinct submit button and set of elements,
  // but rendering in a single <form /> causes problems with required fields --
  // if a node belongs to group "a" and is required, but the user submits group "b",
  // those "a" group nodes shouldn't be required, but will prevent the form from
  // being submitted.
  return flowId && ui ? (
    <>
      <form
        ref={formRef}
        action={ui.action}
        method={ui.method}
        onSubmit={(e) => {
          console.log("submit", {
            target: e.target,
            currentTarget: e.currentTarget,
            type: e.type,
            nativeEvent: e.nativeEvent,
            // @ts-ignore
            method: e.currentTarget.elements.method,
            activeElement: document.activeElement,
          });
          //@ts-ignore
          window.test = e.nativeEvent;
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
              formData.set(
                submitter.attributes.name,
                submitter.attributes.value
              );
            }
          }

          submitFlow({
            action: ui.action,
            method: ui.method,
            body: new URLSearchParams(formData as any).toString(),
          })
            .then(() => {
              flowQuery.refetch();
            })
            .then(() => {
              whoami.refetch();
            });
        }}
      >
        {ui.nodes.map((node, index) => (
          <SelfServiceUiNode
            key={index}
            node={node}
            isSubmitting={submitFlowResult.isLoading}
          />
        ))}
      </form>
      <Box mt={3}>
        {ui.messages?.map((message) => (
          <SelfServiceUiMessage key={message.id} message={message} />
        ))}
      </Box>
    </>
  ) : (
    <Box p={6}>
      <Spinner thickness="5px" color="blue.600" size="xl" />
    </Box>
  );
};
