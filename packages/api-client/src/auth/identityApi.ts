import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import snakecaseKeys from "snakecase-keys";
import { appApi } from "../api/appApi";
import { getApiHost } from "../config";
import { invalidateSession } from "./authApi";
import { IdentitySliceState } from "./identitySlice";
import { FlowError, flowErrorSchema } from "./schemas/errors";
import { InitializeFlowParams } from "./schemas/flows/common";
import {
  InitializeLoginFlowParams,
  LoginFlow,
  LoginFlowResponse,
  isLoginFlow,
  isLoginFlowSuccess,
  loginFlowResponseSchema,
  loginFlowSchema,
} from "./schemas/flows/login";
import { selfServiceLogoutUrlSchema } from "./schemas/flows/logout";
import { RecoveryFlow, recoveryFlowSchema } from "./schemas/flows/recovery";
import {
  RegistrationFlow,
  RegistrationFlowResponse,
  isRegistrationFlow,
  isRegistrationFlowSuccess,
  registrationFlowResponseSchema,
  registrationFlowSchema,
} from "./schemas/flows/registration";
import { SettingsFlow, settingsFlowSchema } from "./schemas/flows/settings";
import {
  VerificationFlow,
  verificationFlowSchema,
} from "./schemas/flows/verification";
import { WhoamiResponse, whoamiResponseSchema } from "./schemas/whoami";
export interface SubmitFlowPayload {
  action: string;
  method: string;
  body: unknown;
}

const baseQuery: ReturnType<typeof fetchBaseQuery> = (...args) =>
  fetchBaseQuery({
    baseUrl: `${getApiHost()}/kratos/public`,
    prepareHeaders: (headers, api) => {
      headers.set("Accept", "application/json");
      const state = api.getState() as IdentitySliceState;
      const { sessionToken } = state.identity;
      if (sessionToken) {
        headers.set("Authorization", `Bearer ${sessionToken}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  })(...args);

/**
 * The identity API is used to access Kratos API endpoints directly (as
 * opposed to going through the api-server).
 */
export const identityApi = createApi({
  reducerPath: "identityApi",
  baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === "persist/REHYDRATE" && action.payload) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (build) => ({
    whoami: build.query<WhoamiResponse, void>({
      query: () => "/sessions/whoami",
      transformResponse: (response) => whoamiResponseSchema.parse(response),
    }),

    /************************************************************
     * User-facing flow errors
     * https://www.ory.sh/kratos/docs/self-service/flows/user-facing-errors/
     ************************************************************/

    getFlowError: build.query<FlowError, string>({
      query: (id) => `/self-service/errors?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => flowErrorSchema.parse(response),
    }),

    /************************************************************
     * login
     ************************************************************/

    getLoginFlow: build.query<LoginFlow, string>({
      query: (id) => `/self-service/login/flows?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => loginFlowSchema.parse(response),
    }),

    initializeLoginFlow: build.mutation<
      LoginFlow,
      InitializeLoginFlowParams | undefined
    >({
      query: (params = {}) => ({
        url: `/self-service/login/${params.clientType || "browser"}`,
        params: snakecaseKeys(params),
      }),
      transformResponse: (response) => loginFlowSchema.parse(response),
    }),

    submitLoginFlow: build.mutation<LoginFlowResponse, SubmitFlowPayload>({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          loginFlowResponseSchema.safeParse(body).success,
      }),
      transformResponse: (response) => loginFlowResponseSchema.parse(response),
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (isLoginFlow(data)) {
          dispatch(
            identityApi.util.updateQueryData(
              "getLoginFlow",
              data.id,
              () => data,
            ),
          );
        } else if (isLoginFlowSuccess(data)) {
          dispatch(identityApi.util.resetApiState());
          dispatch(appApi.util.resetApiState());
        }
      },
    }),

    /************************************************************
     * registration
     ************************************************************/

    getRegistrationFlow: build.query<RegistrationFlow, string>({
      query: (id) =>
        `/self-service/registration/flows?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => registrationFlowSchema.parse(response),
    }),

    initializeRegistrationFlow: build.mutation<
      RegistrationFlow,
      InitializeFlowParams | undefined
    >({
      query: (params = {}) => ({
        url: `/self-service/registration/${params.clientType || "browser"}`,
        params: snakecaseKeys(params),
      }),
      transformResponse: (response) => registrationFlowSchema.parse(response),
    }),

    submitRegistrationFlow: build.mutation<
      RegistrationFlowResponse,
      SubmitFlowPayload
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          registrationFlowResponseSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        registrationFlowResponseSchema.parse(response),
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        if (isRegistrationFlow(data)) {
          dispatch(
            identityApi.util.updateQueryData(
              "getRegistrationFlow",
              data.id,
              () => data,
            ),
          );
        } else if (isRegistrationFlowSuccess(data)) {
          dispatch(identityApi.util.resetApiState());
          dispatch(appApi.util.resetApiState());
        }
      },
    }),

    /************************************************************
     * verification
     ************************************************************/

    getVerificationFlow: build.query<VerificationFlow, string>({
      query: (id) =>
        `/self-service/verification/flows?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => verificationFlowSchema.parse(response),
    }),

    initializeVerificationFlow: build.mutation<
      VerificationFlow,
      InitializeFlowParams | undefined
    >({
      query: (params = {}) => ({
        url: "/self-service/verification/browser",
        params: snakecaseKeys(params),
      }),
      transformResponse: (response) => verificationFlowSchema.parse(response),
    }),

    submitVerificationFlow: build.mutation<VerificationFlow, SubmitFlowPayload>(
      {
        query: ({ action, method, body }) => ({
          url: action,
          method,
          body,
          validateStatus: (_response, body) =>
            verificationFlowSchema.safeParse(body).success,
        }),
        transformResponse: (response) => verificationFlowSchema.parse(response),
        async onQueryStarted(_params, { dispatch, queryFulfilled }) {
          const { data } = await queryFulfilled;
          dispatch(
            identityApi.util.updateQueryData(
              "getVerificationFlow",
              data.id,
              () => data,
            ),
          );
        },
      },
    ),

    /************************************************************
     * recovery
     ************************************************************/

    getRecoveryFlow: build.query<RecoveryFlow, string>({
      query: (id) =>
        `/self-service/recovery/flows?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => recoveryFlowSchema.parse(response),
    }),

    initializeRecoveryFlow: build.mutation<
      RecoveryFlow,
      InitializeFlowParams | undefined
    >({
      query: (params = {}) => ({
        url: "/self-service/recovery/browser",
        params: snakecaseKeys(params),
      }),
      transformResponse: (response) => recoveryFlowSchema.parse(response),
    }),

    submitRecoveryFlow: build.mutation<RecoveryFlow, SubmitFlowPayload>({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          recoveryFlowSchema.safeParse(body).success,
      }),
      transformResponse: (response) => recoveryFlowSchema.parse(response),
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          identityApi.util.updateQueryData(
            "getRecoveryFlow",
            data.id,
            () => data,
          ),
        );
      },
    }),

    /************************************************************
     * settings
     ************************************************************/

    getSettingsFlow: build.query<SettingsFlow, string>({
      query: (id) =>
        `/self-service/settings/flows?id=${encodeURIComponent(id)}`,
      transformResponse: (response) => settingsFlowSchema.parse(response),
    }),

    initializeSettingsFlow: build.mutation<
      SettingsFlow,
      InitializeFlowParams | undefined
    >({
      query: (params = {}) => ({
        url: "/self-service/settings/browser",
        params: snakecaseKeys(params),
      }),
      transformResponse: (response) => settingsFlowSchema.parse(response),
    }),

    submitSettingsFlow: build.mutation<SettingsFlow, SubmitFlowPayload>({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          settingsFlowSchema.safeParse(body).success,
      }),
      transformResponse: (response) => settingsFlowSchema.parse(response),
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          identityApi.util.updateQueryData(
            "getSettingsFlow",
            data.id,
            () => data,
          ),
        );
        dispatch(invalidateSession());
      },
    }),

    /************************************************************
     * logout
     ************************************************************/

    createLogoutUrl: build.mutation<string, void>({
      query: () => ({
        url: "/self-service/logout/browser",
        method: "GET",
      }),
      transformResponse: (response) =>
        selfServiceLogoutUrlSchema.parse(response).logout_url,
    }),

    logoutNative: build.mutation<void, string>({
      query: (sessionToken) => ({
        url: "/self-service/logout/api",
        method: "DELETE",
        body: {
          performNativeLogoutBody: {
            session_token: sessionToken,
          },
        },
      }),
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(identityApi.util.resetApiState());
        dispatch(appApi.util.resetApiState());
      },
    }),

    logout: build.mutation<void, string>({
      query: (url) => url,
      async onQueryStarted(_params, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(identityApi.util.resetApiState());
        dispatch(appApi.util.resetApiState());
      },
    }),
  }),
});
