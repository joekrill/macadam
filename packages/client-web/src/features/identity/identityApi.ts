import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { KnownError } from "../errors/KnownError";
import {
  SelfServiceFlow,
  SelfServiceFlowType,
  SelfServiceLoginFlow,
  selfServiceLoginFlowResponseSchema,
  selfServiceLoginFlowSchema,
  SelfServiceLoginFlowSuccess,
  selfServiceLogoutUrlSchema,
  SelfServiceRecoveryFlow,
  selfServiceRecoveryFlowSchema,
  SelfServiceRegistrationFlow,
  selfServiceRegistrationFlowResponseSchema,
  selfServiceRegistrationFlowSchema,
  SelfServiceRegistrationFlowSuccess,
  SelfServiceSettingsFlow,
  selfServiceSettingsFlowSchema,
  selfServiceSettingsFlowSubmitResponseSchema,
  SelfServiceVerificationFlow,
  selfServiceVerificationFlowSchema,
} from "./schemas";
import { Session, sessionSchema } from "./schemas/session";

export const baseQuery = fetchBaseQuery({
  // NOTE: if kratos instance is at a different origin, make sure to enable:
  // credentials: "include",
  baseUrl: "/kratos/public",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const identityApi = createApi({
  baseQuery,
  tagTypes: [
    "SelfServiceLoginFlow",
    "SelfServiceRegistrationFlow",
    "SelfServiceVerificationFlow",
    "SelfServiceRecoveryFlow",
    "SelfServiceSettingsFlow",
    "SelfServiceFlow",
    "Session",
  ],
  endpoints: (build) => ({
    initializeLoginFlow: build.query<SelfServiceLoginFlow, void>({
      query: () => ({
        url: "/self-service/login/browser",
        headers: {
          Accept: "application/json",
        },
      }),
      transformResponse: (response) => {
        return selfServiceLoginFlowSchema.parse(response);
      },
      providesTags: (result) =>
        result ? [{ type: "SelfServiceLoginFlow", id: result.id }] : [],
    }),

    submitLoginFlow: build.mutation<
      SelfServiceLoginFlowSuccess | SelfServiceLoginFlow,
      { action: string; method: string; body: any }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          selfServiceLoginFlowResponseSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        selfServiceLoginFlowResponseSchema.parse(response),
    }),

    initializeRegistrationFlow: build.query<SelfServiceRegistrationFlow, void>({
      query: () => ({
        url: "/self-service/registration/browser",
        headers: {
          Accept: "application/json",
        },
      }),
      transformResponse: (response) => {
        return selfServiceRegistrationFlowSchema.parse(response);
      },
      providesTags: (result) =>
        result ? [{ type: "SelfServiceRegistrationFlow", id: result.id }] : [],
    }),

    submitRegistrationFlow: build.mutation<
      SelfServiceRegistrationFlowSuccess | SelfServiceRegistrationFlow,
      { action: string; method: string; body: any }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          selfServiceRegistrationFlowResponseSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        selfServiceRegistrationFlowResponseSchema.parse(response),
    }),

    getVerificationFlow: build.query<
      SelfServiceVerificationFlow,
      string | undefined | null
    >({
      query: (id) =>
        id
          ? `self-service/verification/flows?id=${id}`
          : "/self-service/verification/browser",
      transformResponse: (response) => {
        return selfServiceVerificationFlowSchema.parse(response);
      },
      providesTags: (result) =>
        result ? [{ type: "SelfServiceVerificationFlow", id: result.id }] : [],
    }),

    submitVerificationFlow: build.mutation<
      SelfServiceVerificationFlow,
      { action: string; method: string; body: any }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          selfServiceVerificationFlowSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        selfServiceVerificationFlowSchema.parse(response),
    }),

    getRecoveryFlow: build.query<
      SelfServiceRecoveryFlow,
      string | undefined | null
    >({
      query: (id) =>
        id
          ? `self-service/recovery/flows?id=${id}`
          : "/self-service/recovery/browser",
      transformResponse: (response) => {
        return selfServiceRecoveryFlowSchema.parse(response);
      },
      providesTags: (result) =>
        result ? [{ type: "SelfServiceRecoveryFlow", id: result.id }] : [],
    }),

    submitRecoveryFlow: build.mutation<
      SelfServiceRecoveryFlow,
      { action: string; method: string; body: any }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          selfServiceRecoveryFlowSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        selfServiceRecoveryFlowSchema.parse(response),
    }),

    getSettingsFlow: build.query<
      SelfServiceSettingsFlow,
      string | undefined | null
    >({
      query: (id) =>
        id
          ? `self-service/settings/flows?id=${id}`
          : "/self-service/settings/browser",
      transformResponse: (response) => {
        return selfServiceSettingsFlowSchema.parse(response);
      },
      providesTags: (result) =>
        result ? [{ type: "SelfServiceSettingsFlow", id: result.id }] : [],
    }),

    submitSettingsFlow: build.mutation<
      SelfServiceSettingsFlow,
      { action: string; method: string; body: any }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        validateStatus: (_response, body) =>
          selfServiceSettingsFlowSubmitResponseSchema.safeParse(body).success,
      }),
      transformResponse: (response) =>
        selfServiceSettingsFlowSubmitResponseSchema.parse(response).flow,
    }),

    // initializeFlow: build.query<SelfServiceFlow, SelfServiceFlowType>({
    initializeFlow: build.query<string, SelfServiceFlowType>({
      // query: (type) => `self-service/${type}/browser`,
      // It is currently necessary to make a "reqular" page request first to
      // initialze a flow in kratos, which will redirect to a URL that includes
      // the flow ID. Soon krator will supports JSON for browser flows which
      // should make this simpler: https://github.com/ory/kratos/issues/1138
      query: (type) => ({
        url: `self-service/${type}/browser`,
        headers: {
          "Content-Type": "text/html",
          // Accept: "application/json",

          //   "Content-Type": "text/html",
        },
        responseHandler: (response) => {
          const url = new URL(response.url);
          const params = new URLSearchParams(url.search);
          if (params.has("flow")) {
            return Promise.resolve(params.get("flow"));
          }

          if (response.redirected) {
            // If we were redirect, the call to our kratos instance succeeded
            // (so this isn't a network error or something similar), but we
            // weren't given a flowId, probably because we are in an invalid
            // state to request the given flow (i.e. we are requesting a login
            // flow, but are already authenticated)
            return Promise.reject(
              new KnownError("identity/invalid_state", "Unable to start flow")
            );
          }

          return Promise.reject(new Error("No flow ID returned"));
        },
      }),
      providesTags: (result) =>
        result ? [{ type: "SelfServiceFlow", id: result }] : [],
    }),

    getFlow: build.query<
      SelfServiceFlow,
      { type: SelfServiceFlowType; id: string }
    >({
      query: ({ type, id }) => `self-service/${type}/flows?id=${id}`,
      providesTags: (_result, _error, { id }) => [
        { type: "SelfServiceFlow", id },
      ],
    }),

    submitFlow: build.mutation<
      SelfServiceFlow,
      { action: string; method: string; body: Object }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
      }),
      invalidatesTags: (result, _error) =>
        result ? [{ type: "SelfServiceFlow", id: result.id }] : [],
    }),

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

    whoami: build.query<Session, void>({
      query: () => `/sessions/whoami`,
      transformResponse: (response) => sessionSchema.parse(response),
      providesTags: () => [{ type: "Session", id: "CURRENT" }],
    }),
  }),
});

export const { useWhoamiQuery, useSubmitFlowMutation } = identityApi;
