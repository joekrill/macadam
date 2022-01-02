import { Container } from "@chakra-ui/react";
import { Card } from "../../common/components/Card/Card";
import { Verification } from "../components/flows/verification/Verification";
import { useAuthPageParams } from "./useAuthPageParams";

export const VerificationPage = () => {
  const { aal: _aal, refresh: _referesh, ...params } = useAuthPageParams();

  return (
    <Card as={Container} maxW="md">
      <Verification {...params} />
    </Card>
  );
};
