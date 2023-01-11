import { IdentitySliceState } from "../identitySlice";

export const selectIdentity = (state: IdentitySliceState) =>
  state.identity.identity;
