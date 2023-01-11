import { IdentitySliceState } from "../identitySlice";

export const selectPendingVerifiableAddresses = (state: IdentitySliceState) =>
  state.identity.identity?.verifiable_addresses?.filter(
    (address) => !address.verified && address.status === "sent"
  ) || [];
