import { Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRedirectOnLogin } from "../hooks/useRedirectOnLogin";
import { SelfService } from "./SelfService";

export const Login = () => {
  useRedirectOnLogin();

  return (
    <VStack>
      <SelfService flowType="login" title="Log In" />
      <Link as={RouterLink} to="/auth/recovery">
        Forgot password
      </Link>
    </VStack>
  );
};
