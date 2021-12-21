import { useReturnToProvider } from "../../routing/hooks/useReturnToProvider";
import { LOGIN_PATH } from "./useLoginLocation";

export const REGISTRATION_PATH = "/signup";

export const useRegistrationLocation = () => {
  const returnTo = useReturnToProvider({
    forbid: [`${LOGIN_PATH}/*`, `${REGISTRATION_PATH}/*`],
    fallback: "/",
  });

  return {
    to: REGISTRATION_PATH,
    state: returnTo ? { returnTo } : undefined,
  };
};
