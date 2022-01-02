import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { Login } from "../components/flows/login/Login";
import { useAuthPageParams } from "./useAuthPageParams";

export const LoginPage = () => {
  const params = useAuthPageParams();

  return (
    <Card as={Container} maxW="md">
      <Login {...params} />
    </Card>
  );
};
