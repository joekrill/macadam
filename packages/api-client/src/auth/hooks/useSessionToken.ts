import { createContext, useContext } from "react";
import { useIdentitySelector } from "../identitySlice";
import { selectSessionToken } from "../selectors/selectSessionToken";

export const UseSessionTokenContext = createContext({
  selectSessionToken,
});

export const useSessionToken = () => {
  const ctx = useContext(UseSessionTokenContext);
  return useIdentitySelector((state) => ctx.selectSessionToken(state));
};
