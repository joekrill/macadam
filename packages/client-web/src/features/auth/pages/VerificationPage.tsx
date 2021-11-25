import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { Verification } from "../components/Verification";

export const VerificationPage = () => {
  const params = useUrlSearchParams();

  return (
    <Card as={Container} maxW="md">
      <Verification
        flowId={params.get("flow") || undefined}
        returnTo={params.get("return_to") || undefined}
      />
    </Card>
  );
};
