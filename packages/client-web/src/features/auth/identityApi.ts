import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import snakecaseKeys from "snakecase-keys";
import { InitializeFlowParams } from "./schemas/flows/common";
import {
  InitializeLoginFlowParams,
  isLoginFlow,
  isLoginFlowSuccess,
  LoginFlow,
  LoginFlowResponse,
  loginFlowResponseSchema,
  loginFlowSchema,
} from "./schemas/flows/login";
import { selfServiceLogoutUrlSchema } from "./schemas/flows/logout";
import { RecoveryFlow, recoveryFlowSchema } from "./schemas/flows/recovery";
import {
  isRegistrationFlow,
  isRegistrationFlowSuccess,
  RegistrationFlow,
  RegistrationFlowResponse,
  registrationFlowResponseSchema,
  registrationFlowSchema,
} from "./schemas/flows/registration";
import { SettingsFlow, settingsFlowSchema } from "./schemas/flows/settings";
import {
  VerificationFlow,
  verificationFlowSchema,
} from "./schemas/flows/verification";
import { Session, sessionSchema } from "./schemas/session";

export const baseQuery = fetchBaseQuery({
  baseUrl: "/kratos/public",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export interface SubmitFlowPayload {
  action: string;
  method: string;
  body: any;
}

export const identityApi = createApi({
  reducerPath: "identityApi",
  baseQuery,
  tagTypes: ["Session"],
  endpoints: (build) => ({
    /************************************************************
     * whoami
     ************************************************************/

    whoami: build.query<Session, void>({
      query: () => `/sessions/whoami`,
      transformResponse: (response) => sessionSchema.parse(response),
      providesTags: () => [{ type: "Session", id: "CURRENT" }],
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
        url: "/self-service/login/browser",
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
        try {
          const { data } = await queryFulfilled;
          if (isLoginFlow(data)) {
            dispatch(
              identityApi.util.updateQueryData(
                "getLoginFlow",
                data.id,
                () => data
              )
            );
          } else if (isLoginFlowSuccess(data)) {
            dispatch(
              identityApi.util.updateQueryData(
                "whoami",
                undefined,
                () => data.session
              )
            );
          }
        } catch {}
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
        url: "/self-service/registration/browser",
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
        try {
          const { data } = await queryFulfilled;
          if (isRegistrationFlow(data)) {
            dispatch(
              identityApi.util.updateQueryData(
                "getRegistrationFlow",
                data.id,
                () => data
              )
            );
          } else if (isRegistrationFlowSuccess(data) && data.session) {
            dispatch(
              identityApi.util.updateQueryData(
                "whoami",
                undefined,
                () => data.session
              )
            );
          }
        } catch {}
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
          try {
            const { data } = await queryFulfilled;
            dispatch(
              identityApi.util.updateQueryData(
                "getVerificationFlow",
                data.id,
                () => data
              )
            );
          } catch {}
        },
      }
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
        try {
          const { data } = await queryFulfilled;
          dispatch(
            identityApi.util.updateQueryData(
              "getRecoveryFlow",
              data.id,
              () => data
            )
          );
        } catch {}
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
        try {
          const { data } = await queryFulfilled;
          dispatch(
            identityApi.util.updateQueryData(
              "getSettingsFlow",
              data.id,
              () => data
            )
          );
          dispatch(invalidateSession());
        } catch {}
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

    logout: build.mutation<void, string>({
      query: (url) => url,
      invalidatesTags: (_, error) =>
        error ? [] : [{ type: "Session", id: "CURRENT" }],
    }),
  }),
});

export const invalidateSession = () =>
  identityApi.util.invalidateTags([{ type: "Session", id: "CURRENT" }]);

export const { useWhoamiQuery, useSubmitLoginFlowMutation } = identityApi;
