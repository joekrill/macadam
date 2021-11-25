import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { Settings } from "../components/settings/Settings";

export const SettingsPage = () => {
  const params = useUrlSearchParams();

  return (
    <Card as={Container} maxW="xl">
      <Settings
        flowId={params.get("flow") || undefined}
        returnTo={params.get("return_to") || undefined}
      />
    </Card>
  );
};
