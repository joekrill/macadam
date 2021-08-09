import { createSlice } from "@reduxjs/toolkit";
import { identityApi } from "./identityApi";
import {
  isSelfServiceLoginFlowSuccess,
  isSelfServiceRegistrationFlowSuccess
} from "./schemas";
import { Identity } from "./schemas/identity";
import { Session } from "./schemas/session";

export interface IdentityState {
  session?: Omit<Session, "identity">;
  identity?: Identity;
  sessionLastUpdated?: number;
}

export const identitySlice = createSlice({
  name: "identity",
  initialState: {} as IdentityState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      identityApi.endpoints.submitLoginFlow.matchFulfilled,
      (state, { payload }) => {
        if (isSelfServiceLoginFlowSuccess(payload)) {
          const { identity, ...session } = payload.session;
          state.session = session;
          state.identity = identity;
          state.sessionLastUpdated = Date.now();
        }
      }
    );
    builder.addMatcher(
      identityApi.endpoints.submitRegistrationFlow.matchFulfilled,
      (state, { payload }) => {
        if (isSelfServiceRegistrationFlowSuccess(payload)) {
          state.identity = payload.identity;
          state.sessionLastUpdated = Date.now();
        }
      }
    );
    builder.addMatcher(identityApi.endpoints.logout.matchFulfilled, (state) => {
      state.session = undefined;
      state.sessionLastUpdated = Date.now();
    });
    builder.addMatcher(
      identityApi.endpoints.whoami.matchFulfilled,
      (state, { payload }) => {
        const { identity, ...session } = payload;
        state.session = session;
        state.identity = identity;
        state.sessionLastUpdated = Date.now();
      }
    );
    builder.addMatcher(
      identityApi.endpoints.whoami.matchRejected,
      (state, { payload }) => {
        if (payload?.status === 401) {
          state.session = undefined;
          state.sessionLastUpdated = Date.now();
        }
      }
    );
  },
});

export const { name, reducer } = identitySlice;
