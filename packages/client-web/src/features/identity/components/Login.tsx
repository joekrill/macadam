import { Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { SelfService } from "./SelfService";

export const Login = () => (
  <VStack>
    <SelfService flowType="login" title="Log In" />
    <Link as={RouterLink} to="/auth/recovery">
      Forgot password
    </Link>
  </VStack>
);
