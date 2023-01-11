import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IdentitySliceState } from "../auth/identitySlice";
import { getApiHost } from "../config";

const baseQuery: ReturnType<typeof fetchBaseQuery> = (...args) =>
  fetchBaseQuery({
    baseUrl: `${getApiHost()}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers, api) => {
      headers.set("Accept", "application/json");
      const state = api.getState() as IdentitySliceState;
      const { sessionToken } = state.identity;
      if (sessionToken) {
        headers.set("Authorization", `Bearer ${sessionToken}`);
      }
      return headers;
    },
  })(...args);

export const appApi = createApi({
  reducerPath: "api",
  baseQuery,
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === "persist/REHYDRATE" && action.payload) {
      return action.payload[reducerPath];
    }
  },
  endpoints: () => ({}),
});
