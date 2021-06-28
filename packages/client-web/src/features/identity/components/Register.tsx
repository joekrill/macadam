import { Link, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRedirectOnLogin } from "../hooks/useRedirectOnLogin";
import { SelfService } from "./SelfService";

export const Register = () => {
  useRedirectOnLogin();

  return (
    <SelfService flowType="registration" title="Sign Up">
      <Text>
        Already have an account?{" "}
        <Link as={RouterLink} to="/auth/login">
          Log in.
        </Link>
      </Text>
    </SelfService>
  );
};
