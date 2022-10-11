import { AuthSliceState } from "../authSlice";

export const selectSession = (state: AuthSliceState) => state.auth.session;
