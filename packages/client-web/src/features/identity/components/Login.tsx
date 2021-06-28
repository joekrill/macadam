import { Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRedirectOnLogin } from "../hooks/useRedirectOnLogin";
import { SelfService } from "./SelfService";

export const Login = () => {
  useRedirectOnLogin();

  return (
    <SelfService flowType="login" title="Log In">
      <Link as={RouterLink} to="/auth/recovery">
        Forgot your password?
      </Link>

      <Text mt={2}>
        Don't have an account yet?{" "}
        <Link as={RouterLink} to="/auth/registration">
          Sign up.
        </Link>
      </Text>
    </SelfService>
  );
};
