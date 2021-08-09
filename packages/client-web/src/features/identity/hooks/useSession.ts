import { useAppSelector } from "../../../app/hooks";
import { useWhoamiQuery } from "../identityApi";
import { selectIdentity } from "../selectors/selectIdentity";
import { selectSession } from "../selectors/selectSession";

export const useSession = () => {
  const session = useAppSelector((state) => selectSession(state));
  const identity = useAppSelector((state) => selectIdentity(state));
  const lastUpdated = useAppSelector(
    (state) => state.identity.sessionLastUpdated
  );

  const whoamiQuery = useWhoamiQuery(undefined, {
    skip: lastUpdated !== undefined,
  });

  return {
    ...whoamiQuery,
    data: session,
    isLoggedIn: lastUpdated === undefined ? undefined : !!session,
    isLoggedOut: lastUpdated === undefined ? undefined : !session,
    lastUpdated,
    isUninitialized: !lastUpdated,
    isLoading: !lastUpdated && whoamiQuery.isLoading,
    username: identity?.traits?.email,
  };
};
