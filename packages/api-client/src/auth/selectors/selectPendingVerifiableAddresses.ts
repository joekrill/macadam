import { AuthSliceState } from "../authSlice";

export const selectPendingVerifiableAddresses = (state: AuthSliceState) =>
  state.auth.identity?.verifiable_addresses?.filter(
    (address) => !address.verified && address.status === "sent"
  ) || [];
