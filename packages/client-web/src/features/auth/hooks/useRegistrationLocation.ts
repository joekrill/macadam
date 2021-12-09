import { useReturnToProvider } from "../../routing/hooks/useReturnToProvider";
import { LOGIN_PATH } from "./useLoginLocation";

export const REGISTRATION_PATH = "/auth/registration";

export const useRegistrationLocation = () => {
  const returnTo = useReturnToProvider({
    forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    fallback: "/",
  });

  return {
    pathname: REGISTRATION_PATH,
    state: returnTo ? { returnTo } : undefined,
  };
};
