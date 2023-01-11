import { IdentitySliceState } from "../identitySlice";

export const selectSessionToken = (state: IdentitySliceState) =>
  state.identity.sessionToken;
