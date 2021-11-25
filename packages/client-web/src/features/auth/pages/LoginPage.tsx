import { Container } from "@chakra-ui/react";
import { useMemo } from "react";
import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { Login } from "../components/login/Login";
import { authenticatorAssuranceLevelSchema } from "../schemas/session";

export const LoginPage = () => {
  const params = useUrlSearchParams();
  const aal = useMemo(() => {
    try {
      return authenticatorAssuranceLevelSchema.parse(params.get("aal"));
    } catch (_) {
      return undefined;
    }
  }, [params]);

  return (
    <Card as={Container} maxW="md">
      <Login
        aal={aal}
        flowId={params.get("flow") || undefined}
        refresh={params.has("refresh")}
        returnTo={params.get("return_to") || undefined}
      />
    </Card>
  );
};
