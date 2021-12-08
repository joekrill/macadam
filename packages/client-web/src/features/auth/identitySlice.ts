import { createSlice } from "@reduxjs/toolkit";
import { identityApi } from "./identityApi";
import { isLoginFlowSuccess } from "./schemas/flows/login";
import { isRegistrationFlowSuccess } from "./schemas/flows/registration";
import { Identity } from "./schemas/identity";
import { Session } from "./schemas/session";

export interface IdentityState {
  session?: Omit<Session, "identity">;
  identity?: Identity;
  lastUpdated?: number;
}

export const identitySlice = createSlice({
  name: "identity",
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
      identityApi.endpoints.whoami.matchFulfilled,
      (state, { payload }) => {
        const { identity, ...session } = payload;
        state.session = session;
        state.identity = identity;
        state.lastUpdated = Date.now();
      }
    );
    builder.addMatcher(
      identityApi.endpoints.whoami.matchRejected,
      (state, { payload }) => {
        if (payload?.status === 401) {
          state.session = undefined;
          state.identity = undefined;
          state.lastUpdated = Date.now();
        }
      }
    );
  },
});

export const { name, reducer } = identitySlice;
