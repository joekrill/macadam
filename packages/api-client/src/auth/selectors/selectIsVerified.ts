import { IdentitySliceState } from "../identitySlice";

export const selectIsVerified = (state: IdentitySliceState) =>
  !!state.identity.identity?.verifiable_addresses?.some(
    ({ verified }) => verified,
  );
