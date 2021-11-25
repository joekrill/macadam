import { useReturnToProvider } from "../../routing/hooks/useReturnToProvider";
import { LOGIN_PATH } from "./useLoginLocation";

export const REGISTRATION_PATH = "/auth/registration";

export const useRegistrationLocation = () => {
  const returnTo = useReturnToProvider({
    forbid: [REGISTRATION_PATH, LOGIN_PATH],
    fallback: "/",
  });

  return {
    pathname: REGISTRATION_PATH,
    state: returnTo ? { returnTo } : undefined,
  };
};
