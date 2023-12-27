import { createSelector } from "@reduxjs/toolkit";
import { IdentitySliceState } from "../identitySlice";

export const selectPendingVerifiableAddresses = createSelector(
  [
    (state: IdentitySliceState) =>
      state.identity.identity?.verifiable_addresses,
  ],
  (addresses) =>
    addresses?.filter(
      (address) => !address.verified && address.status === "sent",
    ) || [],
);
