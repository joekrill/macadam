import { Spinner } from "@chakra-ui/react";
import { identityApi } from "../identityApi";
import { SelfServiceFlowType } from "../identityTypes";
import { SelfServiceUi } from "./SelfServiceUi";

export interface SelfServiceProps {
  flowType: SelfServiceFlowType;
}

export const SelfService = ({ flowType }: SelfServiceProps) => {
  const flowId = identityApi.useInitializeFlowQuery(flowType);

  if (flowId.isLoading ) {
    return <Spinner size="xl" />
  }

  return (<SelfServiceUi flowId={flowId.data} flowType={flowType} />);
};
