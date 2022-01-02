import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { Registration } from "../components/flows/registration/Registration";
import { useAuthPageParams } from "./useAuthPageParams";

export const RegistrationPage = () => {
  const { aal: _aal, refresh: _referesh, ...params } = useAuthPageParams();

  return (
    <Card as={Container} maxW="md">
      <Registration {...params} />
    </Card>
  );
};
