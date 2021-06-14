import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  VerificationFlow,
} from "../../features/selfService/types";

export const selfServiceApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: [
    "LoginFlow",
    "RegistrationFlow",
    "RecoveryFlow",
    "VerificationFlow",
    "SettingsFlow",
  ],
  endpoints: (build) => ({
    getLoginFlow: build.query<LoginFlow, string>({
      query: (id) => `self-service/login/flows?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "LoginFlow", id }],
    }),
    getRegistrationFlow: build.query<RegistrationFlow, string>({
      query: (id) => `self-service/registration/flows?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "RegistrationFlow", id }],
    }),
    getRecoveryFlow: build.query<RecoveryFlow, string>({
      query: (id) => `self-service/registration/flows?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "RecoveryFlow", id }],
    }),
    getVerificationFlow: build.query<VerificationFlow, string>({
      query: (id) => `self-service/registration/flows?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "VerificationFlow", id }],
    }),
    getSettingsFlow: build.query<SettingsFlow, string>({
      query: (id) => `self-service/registration/flows?id=${id}`,
      providesTags: (_result, _error, id) => [{ type: "SettingsFlow", id }],
    }),
    whoami: build.query<Session, void>({
      query: () => `/sessions/whoami`,
    }),
  }),
});

// export const {
//   useGetPostQuery,
//   useGetPostsQuery,
//   useAddPostMutation,
//   useUpdatePostMutation,
//   useDeletePostMutation,
// } = api;
