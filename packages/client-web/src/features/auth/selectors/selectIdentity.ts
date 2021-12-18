import { RootState } from "../../../app/store";

export const selectIdentity = (state: RootState) => state.auth.identity;
