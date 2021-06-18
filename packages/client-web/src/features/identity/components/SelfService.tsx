import { Container, Heading } from "@chakra-ui/react";
import { ReactNode } from "react";
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
    <Container
      background="gray.200"
      borderColor="gray.400"
      borderWidth={1}
      borderStyle="solid"
      borderRadius="md"
      maxW="container.sm"
      p={6}
    >
      <Heading as="h2" fontSize="xl">
        {title}
      </Heading>
      <SelfServiceUi flowId={flowId.data} flowType={flowType} />
    </Container>
  );
};
