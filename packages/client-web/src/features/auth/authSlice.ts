import { createSlice } from "@reduxjs/toolkit";
import { selfServiceApi } from "../../services/selfService";

export interface AuthState {
  userId?: string;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      selfServiceApi.endpoints.whoami.matchFulfilled,
      (state, { payload }) => {
        state.userId = payload.id;
      }
    );
  },
});
