import { Container, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Card } from "../../common/components/Card";
import { identityApi } from "../identityApi";
import { SelfServiceFlowType } from "../identityTypes";
import { SelfServiceUi } from "./SelfServiceUi";

export interface SelfServiceProps {
  flowType: SelfServiceFlowType;
  title?: ReactNode;
}

export const SelfService = ({ title, flowType }: SelfServiceProps) => {
  const flowId = identityApi.useInitializeFlowQuery(flowType);

  return (
    <Card as={Container} maxW="container.sm">
      <Heading as="h2" fontSize="xl">
        {title}
      </Heading>
      <SelfServiceUi flowId={flowId.data} flowType={flowType} />
    </Card>
  );
};
