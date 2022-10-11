import { unpackRules } from "@casl/ability/extra";
import { AuthSliceState } from "../authSlice";

export const selectRules = (state: AuthSliceState) =>
  // @ts-ignore
  unpackRules(state.auth.rules || []);
