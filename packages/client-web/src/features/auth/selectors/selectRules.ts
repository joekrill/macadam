import { unpackRules } from "@casl/ability/extra";
import { RootState } from "../../../app/store";

export const selectRules = (state: RootState) =>
  // @ts-ignore
  unpackRules(state.auth.rules || []);
