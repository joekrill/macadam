import { AuthSliceState } from "../authSlice";

export const selectIsVerified = (state: AuthSliceState) =>
  !!state.auth.identity?.verifiable_addresses?.some(({ verified }) => verified);
