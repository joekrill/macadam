import { IdentitySliceState } from "../identitySlice";

export const selectAuthState = (state: IdentitySliceState) =>
  state.identity.authState;
