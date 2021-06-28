import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { Card } from "../../common/components/Card";
import { identityApi } from "../identityApi";
import { SelfServiceFlowType } from "../identityTypes";
import { SelfServiceUi } from "./SelfServiceUi";

export interface SelfServiceProps {
  children?: ReactNode;
  flowType: SelfServiceFlowType;
  title?: ReactNode;
}

export const SelfService = ({
  children,
  title,
  flowType,
}: SelfServiceProps) => {
  const flowId = identityApi.useInitializeFlowQuery(flowType);

  return (
    <Card as={Container} maxW="container.sm">
      <Heading as="h2" fontSize="2xl" mb={8}>
        {title}
      </Heading>
      {flowId.isError ? (
        <Alert
          status="error"
          mt={4}
          displa="flex"
          justifyContent="space-between"
        >
          <Flex>
            <AlertIcon />
            Something went wrong :(
          </Flex>
          <Button colorScheme="red" onClick={() => flowId.refetch()}>
            Try again
          </Button>
        </Alert>
      ) : (
        <SelfServiceUi flowId={flowId.data} flowType={flowType} />
      )}
      <Box mt={8}>{children}</Box>
    </Card>
  );
};
