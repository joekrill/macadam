import { RootState } from "../../../app/store";

export const selectIsVerified = (state: RootState) => !!state.identity.identity?.verifiable_addresses?.[0]?.verified;
