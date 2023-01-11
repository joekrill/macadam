import { createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { identityApi } from "./identityApi";
import {
  sessionAal2RequiredErrorSchema,
  sessionRefreshRequiredErrorSchema,
} from "./schemas/errors";
import { isLoginFlowSuccess } from "./schemas/flows/login";
import { isRegistrationFlowSuccess } from "./schemas/flows/registration";
import { Identity } from "./schemas/identity";
import { Session } from "./schemas/session";

export interface IdentityState {
  session?: Omit<Session, "identity">;
  sessionToken?: string;
  identity?: Identity | null;
  lastUpdated?: number;
  authState?:
    | "authenticated"
    | "unauthenticated"
    | "session_aal2_required"
    | "session_refresh_required";
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
          state.authState = "authenticated";
          state.session = session;
          state.identity = identity;
          state.sessionToken = payload.session_token;
          state.lastUpdated = Date.now();
        }
      }
    );
    builder.addMatcher(
      identityApi.endpoints.submitRegistrationFlow.matchFulfilled,
      (state, { payload }) => {
        if (isRegistrationFlowSuccess(payload)) {
          state.authState = payload.session
            ? "authenticated"
            : "unauthenticated";
          state.session = payload.session;
          state.identity = payload.identity;
          state.sessionToken = payload.session_token;
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
      state.authState = "unauthenticated";
      state.session = undefined;
      state.identity = undefined;
      state.sessionToken = undefined;
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
        state.lastUpdated = Date.now();

        if (payload?.status === 401) {
          state.authState = "unauthenticated";
          state.session = undefined;
          state.identity = undefined;
          state.sessionToken = undefined;
          return;
        }

        if (sessionAal2RequiredErrorSchema.safeParse(payload?.data).success) {
          state.authState = "session_aal2_required";
          return;
        }

        if (
          sessionRefreshRequiredErrorSchema.safeParse(payload?.data).success
        ) {
          state.authState = "session_refresh_required";
          return;
        }

        // TODO - handle unexpected error response here?
      }
    );
  },
});

export interface IdentitySliceState {
  [identitySlice.name]: ReturnType<typeof identitySlice.getInitialState>;
}

export const useIdentitySelector: TypedUseSelectorHook<IdentitySliceState> =
  useSelector;
