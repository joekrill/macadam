import { useAppSelector } from "../../../app/hooks";
import { invalidateSession, useWhoamiQuery } from "../identityApi";
import { selectIdentity } from "../selectors/selectIdentity";
import { selectIsVerified } from "../selectors/selectIsVerified";
import { selectSession } from "../selectors/selectSession";

export const useSession = () => {
  // REVISIT: Refreshing session based on user activity? https://github.com/ory/kratos/issues/615
  const session = useAppSelector((state) => selectSession(state));
  const identity = useAppSelector((state) => selectIdentity(state));
  const isVerified = useAppSelector((state) => selectIsVerified(state));
  const lastUpdated = useAppSelector((state) => state.identity.lastUpdated);

  const whoamiQuery = useWhoamiQuery(undefined, {
    skip: lastUpdated !== undefined,
  });

  return {
    /**
     * True if logged in, false if logged out, undefined if unknown.
     */
    isLoggedIn: lastUpdated === undefined ? undefined : !!session,

    /**
     * True if logged out, false if logged in, undefined if unknown.
     */
    isLoggedOut: lastUpdated === undefined ? undefined : !session,

    /**
     * True when we haven't yet determined if the user is logged in or not.
     */
    isUnknown: !lastUpdated,

    isVerified,

    username: identity?.traits?.email,
    refetch: whoamiQuery.refetch,
    invalidate: invalidateSession,
  };
};
