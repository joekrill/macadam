import { Spinner } from "@chakra-ui/react";
import { useRef } from "react";
import {
  selfServiceApi,
  SelfServiceFlowType,
} from "../../../services/selfService";
import { SelfServiceUiNode } from "./SelfServiceUiNode";

export interface SelfServiceUiProps {
  flowId?: string;
  flowType: SelfServiceFlowType;
}

export const SelfServiceUi = ({ flowId, flowType }: SelfServiceUiProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const whoami = selfServiceApi.useWhoamiQuery();
  const flowQuery = selfServiceApi.useGetFlowQuery(
    { type: flowType, id: flowId || "" },
    {
      skip: !flowId,
    }
  );
  const [submitFlow] = selfServiceApi.useSubmitFlowMutation();

  const ui = flowQuery.data?.ui;

  return ui ? (
    <form
      ref={formRef}
      action={ui.action}
      method={ui.method}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current || undefined);
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
        <SelfServiceUiNode key={index} node={node} />
      ))}
      {ui.messages?.map((message) => (
        <div key={message.id}>{message.text}</div>
      ))}
    </form>
  ) : (
    <Spinner />
  );
};
