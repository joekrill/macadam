import { useSession } from "./useSession";

export const useVerfiyEmailState = () => {
  const { identity, isLoggedIn } = useSession();

  const unverified = identity?.verifiable_addresses?.filter((a) => !a.verified);
  const verified = identity?.verifiable_addresses?.filter((a) => a.verified);
};
