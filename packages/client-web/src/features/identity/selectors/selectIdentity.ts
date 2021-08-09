import { RootState } from "../../../app/store";

export const selectIdentity = (state: RootState) => state.identity.identity;
