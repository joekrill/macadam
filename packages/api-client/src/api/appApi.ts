import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiHost } from "../config";

const baseQuery: ReturnType<typeof fetchBaseQuery> = (...args) =>
  fetchBaseQuery({
    baseUrl: `${getApiHost()}/api/v1`,
    credentials: "include",
    // prepareHeaders: (headers, api) => {
    //   headers.set("Accept", "application/json");
    //   return headers;
    // },
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
