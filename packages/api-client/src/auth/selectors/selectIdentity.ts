import { AuthSliceState } from "../authSlice";

export const selectIdentity = (state: AuthSliceState) => state.auth.identity;
