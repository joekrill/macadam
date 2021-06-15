import { Spinner } from "@chakra-ui/react";
import {
  selfServiceApi,
  SelfServiceFlowType,
} from "../../../services/selfService";
import { SelfServiceUi } from "./SelfServiceUi";

export interface SelfServiceProps {
  flowType: SelfServiceFlowType;
}

export const SelfService = ({ flowType }: SelfServiceProps) => {
  const flowId = selfServiceApi.useInitializeFlowQuery(flowType);

  return (
    <div>
      {flowId.isLoading ? (
        <Spinner size="xl" />
      ) : (
        <SelfServiceUi flowId={flowId.data} flowType={flowType} />
      )}
    </div>
  );
};
