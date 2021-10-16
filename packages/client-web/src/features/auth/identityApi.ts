import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SelfServiceFlow, SelfServiceFlowName } from "./schemas/flows";
import {
  SelfServiceLoginFlow,
  selfServiceLoginFlowResponseSchema,
  selfServiceLoginFlowSchema,
  SelfServiceLoginFlowSuccess,
} from "./schemas/flows/login";
import { selfServiceLogoutUrlSchema } from "./schemas/flows/logout";
import {
  SelfServiceRecoveryFlow,
  selfServiceRecoveryFlowSchema,
} from "./schemas/flows/recovery";
import {
  SelfServiceRegistrationFlow,
  selfServiceRegistrationFlowResponseSchema,
  selfServiceRegistrationFlowSchema,
  SelfServiceRegistrationFlowSuccess,
} from "./schemas/flows/registration";
import {
  SelfServiceSettingsFlow,
  selfServiceSettingsFlowSchema,
  selfServiceSettingsFlowSubmitResponseSchema,
} from "./schemas/flows/settings";
import {
  SelfServiceVerificationFlow,
  selfServiceVerificationFlowSchema,
} from "./schemas/flows/verification";
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

export interface SubmitFlowPayload {
  id: string;
  action: string;
  method: string;
  body: any;
}

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
    initializeFlow: build.query<any, string>({
      query: (name) => ({
        url: `/self-service/${name}/browser`,
        headers: {
          Accept: "application/json",
        },
      }),
    }),

    submitFlow: build.mutation<any, SubmitFlowPayload>({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
      }),
    }),

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

    getFlow: build.query<
      SelfServiceFlow,
      { type: SelfServiceFlowName; id: string }
    >({
      query: ({ type, id }) => `self-service/${type}/flows?id=${id}`,
      providesTags: (_result, _error, { id }) => [
        { type: "SelfServiceFlow", id },
      ],
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

export const invalidateSession = () =>
  identityApi.util.invalidateTags([{ type: "Session", id: "CURRENT" }]);

export const { useWhoamiQuery, useSubmitFlowMutation } = identityApi;
