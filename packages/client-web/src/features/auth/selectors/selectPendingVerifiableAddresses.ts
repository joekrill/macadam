import { RootState } from "../../../app/store";

export const selectPendingVerifiableAddresses = (state: RootState) =>
  state.auth.identity?.verifiable_addresses?.filter(
    (address) => !address.verified && address.status === "sent"
  ) || [];
