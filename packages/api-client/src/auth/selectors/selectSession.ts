import { IdentitySliceState } from "../identitySlice";

export const selectSession = (state: IdentitySliceState) =>
  state.identity.session;
