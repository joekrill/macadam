import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { Recovery } from "../components/flows/recovery/Recovery";
import { useAuthPageParams } from "./useAuthPageParams";

export const RecoveryPage = () => {
  const { aal: _aal, refresh: _referesh, ...params } = useAuthPageParams();

  return (
    <Card as={Container} maxW="md">
      <Recovery {...params} />
    </Card>
  );
};
