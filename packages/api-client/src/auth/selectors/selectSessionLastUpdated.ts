import { AuthSliceState } from "../authSlice";

export const selectSessionLastUpdated = (state: AuthSliceState) =>
  state.auth.lastUpdated;
