import { RootState } from "../../../app/store";

export const selectSessionLastUpdated = (state: RootState) =>
  state.identity.lastUpdated;
