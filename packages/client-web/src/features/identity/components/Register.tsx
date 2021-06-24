import { useRedirectOnLogin } from "../hooks/useRedirectOnLogin";
import { SelfService } from "./SelfService";

export const Register = () => {
  useRedirectOnLogin();
  return <SelfService flowType="registration" title="Sign Up" />;
};
