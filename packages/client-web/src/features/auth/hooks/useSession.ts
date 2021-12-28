import { skipToken } from "@reduxjs/toolkit/query";
import { createContext, useContext } from "react";
import { useAppSelector } from "../../../app/hooks";
import { useWhoamiQuery } from "../authApi";
import { selectIdentity } from "../selectors/selectIdentity";
import { selectIsVerified } from "../selectors/selectIsVerified";
import { selectSession } from "../selectors/selectSession";
import { selectSessionLastUpdated } from "../selectors/selectSessionLastUpdated";

export const UseSessionContext = createContext({
  selectSession,
  selectIdentity,
  selectIsVerified,
  selectSessionLastUpdated,
  whoamiQueryArg: undefined as void | typeof skipToken,
});

// REVISIT: Refreshing session based on user activity? https://github.com/ory/kratos/issues/615

export const useSession = () => {
  // This allows us to mock out various scenarios for Stories and testing
  const ctx = useContext(UseSessionContext);

  useWhoamiQuery(ctx.whoamiQueryArg);

  const session = useAppSelector((state) => ctx.selectSession(state));
  const identity = useAppSelector((state) => ctx.selectIdentity(state));
  const isVerified = useAppSelector((state) => ctx.selectIsVerified(state));
  const lastUpdated = useAppSelector((state) =>
    ctx.selectSessionLastUpdated(state)
  );

  return {
    identity,

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

    traits: identity?.traits || {},

    username: identity?.traits?.email,
  };
};
