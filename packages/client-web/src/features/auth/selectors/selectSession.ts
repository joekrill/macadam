import { RootState } from "../../../app/store";

export const selectSession = (state: RootState) => state.auth.session;
