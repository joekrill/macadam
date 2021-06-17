import { createSlice } from "@reduxjs/toolkit";
import { identityApi } from "./identityApi";

export interface IdentityState {
  userId?: string;
}

export const identitySlice = createSlice({
  name: "identity",
  initialState: {} as IdentityState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      identityApi.endpoints.whoami.matchFulfilled,
      (state, { payload }) => {
        state.userId = payload.id;
      }
    );
  },
});
