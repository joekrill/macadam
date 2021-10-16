import { RootState } from "../../../app/store";

export const selectUnverifiedAddresses = (state: RootState) =>
  !!state.identity.identity?.verifiable_addresses?.filter(
    (address) => !address.verified
  );
