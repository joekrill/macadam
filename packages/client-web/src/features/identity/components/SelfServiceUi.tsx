import { Box, Spinner } from "@chakra-ui/react";
import { identityApi, useWhoamiQuery } from "../identityApi";
import { SelfServiceFlowType, SelfServiceRecoveryFlow } from "../identityTypes";
import { SelfServiceUiMessage } from "./SelfServiceMessage";
import { SelfServiceUiForm } from "./SelfServiceUiForm";

export interface SelfServiceUiProps {
  flowId?: string;
  flowType: SelfServiceFlowType;
}

export const SelfServiceUi = ({ flowId, flowType }: SelfServiceUiProps) => {
  const whoami = useWhoamiQuery();
  const flowQuery = identityApi.useGetFlowQuery(
    { type: flowType, id: flowId || "" },
    {
      skip: !flowId,
    }
  );

  const ui = flowQuery.data?.ui;

  // TODO: Refactor this logic so it lives elsewhere (in the <Recovery /> component?)
  const hideForm =
    flowType === "recovery" &&
    (flowQuery.data as SelfServiceRecoveryFlow)?.state === "sent_email";

  // TODO: It may actually be better to break up the UI into multiple <forms />
  // based on each node's `group` (and including the "default" group nodes in
  // every form). Each group can have a distinct submit button and set of elements,
  // but rendering in a single <form /> causes problems with required fields --
  // if a node belongs to group "a" and is required, but the user submits group "b",
  // those "a" group nodes shouldn't be required, but will prevent the form from
  // being submitted.
  return flowId && ui ? (
    <>
      {!hideForm && (
        <SelfServiceUiForm
          ui={ui}
          onSubmitComplete={() => {
            flowQuery.refetch();
            whoami.refetch();
          }}
        />
      )}
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
