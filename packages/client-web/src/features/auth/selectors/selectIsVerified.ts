import { RootState } from "../../../app/store";

export const selectIsVerified = (state: RootState) =>
  !!state.auth.identity?.verifiable_addresses?.some(({ verified }) => verified);
