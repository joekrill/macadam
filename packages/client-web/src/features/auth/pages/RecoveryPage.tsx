import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../common/hooks/useUrlSearchParams";
import { Recovery } from "../components/Recovery";

export const RecoveryPage = () => {
  const params = useUrlSearchParams();

  return (
    <Card as={Container} maxW="md">
      <Recovery
        flowId={params.get("flow") || undefined}
        returnTo={params.get("return_to") || undefined}
      />
    </Card>
  );
};
