import { useReturnToProvider } from "../../routing/hooks/useReturnToProvider";
import { REGISTRATION_PATH } from "./useRegistrationLocation";

export const LOGIN_PATH = "/auth/login";

export const useLoginLocation = () => {
  const returnTo = useReturnToProvider({
    forbid: [LOGIN_PATH, REGISTRATION_PATH],
    fallback: "/",
  });

  return {
    pathname: LOGIN_PATH,
    state: returnTo ? { returnTo } : undefined,
  };
};
