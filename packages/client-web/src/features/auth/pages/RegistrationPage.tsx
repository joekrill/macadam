import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../common/hooks/useUrlSearchParams";
import { Registration } from "../components/registration/Registration";

export const RegistrationPage = () => {
  const params = useUrlSearchParams();

  return (
    <Card as={Container} maxW="md">
      <Registration
        flowId={params.get("flow") || undefined}
        returnTo={params.get("return_to") || undefined}
      />
    </Card>
  );
};
