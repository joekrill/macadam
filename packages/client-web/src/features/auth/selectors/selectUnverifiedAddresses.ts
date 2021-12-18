import { RootState } from "../../../app/store";

export const selectUnverifiedAddresses = (state: RootState) =>
  !!state.auth.identity?.verifiable_addresses?.filter(
    (address) => !address.verified
  );
