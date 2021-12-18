import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { identityApi } from "./identityApi";
import { isLoginFlowSuccess } from "./schemas/flows/login";
import { isRegistrationFlowSuccess } from "./schemas/flows/registration";
import { Identity } from "./schemas/identity";
import { Session } from "./schemas/session";

export interface IdentityState {
  session?: Omit<Session, "identity">;
  identity?: Identity;
  lastUpdated?: number;
  rules?: unknown;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {} as IdentityState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      identityApi.endpoints.submitLoginFlow.matchFulfilled,
      (state, { payload }) => {
        if (isLoginFlowSuccess(payload)) {
          const { identity, ...session } = payload.session;
          state.session = session;
          state.identity = identity;
          state.lastUpdated = Date.now();
        }
      }
    );
    builder.addMatcher(
      identityApi.endpoints.submitRegistrationFlow.matchFulfilled,
      (state, { payload }) => {
        if (isRegistrationFlowSuccess(payload)) {
          state.session = payload.session;
          state.identity = payload.identity;
          state.lastUpdated = Date.now();
        }
      }
    );
    builder.addMatcher(
      identityApi.endpoints.getSettingsFlow.matchFulfilled,
      (state, { payload }) => {
        state.identity = payload.identity;
        state.lastUpdated = Date.now();
      }
    );
    builder.addMatcher(
      identityApi.endpoints.submitSettingsFlow.matchFulfilled,
      (state, { payload }) => {
        state.identity = payload.identity;
        state.lastUpdated = Date.now();
      }
    );
    builder.addMatcher(identityApi.endpoints.logout.matchFulfilled, (state) => {
      state.session = undefined;
      state.identity = undefined;
      state.lastUpdated = Date.now();
    });
    builder.addMatcher(
      authApi.endpoints.whoami.matchFulfilled,
      (state, { payload }) => {
        state.rules = payload.data.rules;
        state.lastUpdated = Date.now();
        state.session = undefined;

        if (payload.data.session) {
          const { identity, ...session } = payload.data.session;
          state.session = session;
          state.identity = identity;
        }
      }
    );
  },
});

export const { name, reducer } = authSlice;
