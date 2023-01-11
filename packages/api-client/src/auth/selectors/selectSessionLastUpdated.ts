import { IdentitySliceState } from "../identitySlice";

export const selectSessionLastUpdated = (state: IdentitySliceState) =>
  state.identity.lastUpdated;
