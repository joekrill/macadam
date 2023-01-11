import { skipToken } from "@reduxjs/toolkit/query";
import { createContext, useContext } from "react";
import { identityApi } from "../identityApi";
import { useIdentitySelector } from "../identitySlice";
import { selectAuthState } from "../selectors/selectAuthState";
import { selectIdentity } from "../selectors/selectIdentity";
import { selectIsVerified } from "../selectors/selectIsVerified";
import { selectSession } from "../selectors/selectSession";
import { selectSessionLastUpdated } from "../selectors/selectSessionLastUpdated";

export const UseSessionContext = createContext({
  selectAuthState,
  selectIdentity,
  selectIsVerified,
  selectSession,
  selectSessionLastUpdated,
  whoamiQueryArg: undefined as void | typeof skipToken,
});

// REVISIT: Refreshing session based on user activity? https://github.com/ory/kratos/issues/615

export const useSession = () => {
  // This allows us to mock out various scenarios for Stories and testing
  const ctx = useContext(UseSessionContext);

  identityApi.useWhoamiQuery(ctx.whoamiQueryArg);

  const authState = useIdentitySelector((state) => ctx.selectAuthState(state));
  const session = useIdentitySelector((state) => ctx.selectSession(state));
  const identity = useIdentitySelector((state) => ctx.selectIdentity(state));
  const isVerified = useIdentitySelector((state) =>
    ctx.selectIsVerified(state)
  );
  const lastUpdated = useIdentitySelector((state) =>
    ctx.selectSessionLastUpdated(state)
  );

  return {
    authState,

    identity,

    session,

    /**
     * True if logged in, false if logged out, undefined if unknown.
     */
    isLoggedIn: lastUpdated === undefined ? undefined : !!identity,

    /**
     * True if logged out, false if logged in, undefined if unknown.
     */
    isLoggedOut: lastUpdated === undefined ? undefined : !identity,

    /**
     * True when we haven't yet determined if the user is logged in or not.
     */
    isUnknown: !lastUpdated,

    isVerified,

    username: identity?.traits?.email,
  };
};
