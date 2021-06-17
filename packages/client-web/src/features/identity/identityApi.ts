import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SelfServiceFlow, SelfServiceFlowType, Session } from "./identityTypes";

export const identityApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  tagTypes: ["SelfServiceFlow", "Session"],
  endpoints: (build) => ({
    initializeFlow: build.query<string, SelfServiceFlowType>({
      // It is currently necessary to make a "reqular" page request first to
      // initialze a flow in kratos, which will redirect to a URL that includes
      // the flow ID. Soon krator will supports JSON for browser flows which
      // should make this simpler: https://github.com/ory/kratos/issues/1138
      query: (type) => ({
        url: `self-service/${type}/browser`,
        headers: {
          "Content-Type": "text/html",
        },
        responseHandler: (response) => {
          const url = new URL(response.url);
          const params = new URLSearchParams(url.search);
          if (params.has("flow")) {
            return Promise.resolve(params.get("flow"));
          }
          return Promise.reject("No flow ID returned");
        },
      }),
    }),
    getFlow: build.query<
      SelfServiceFlow,
      { type: SelfServiceFlowType; id: string }
    >({
      query: ({ type, id }) => `self-service/${type}/flows?id=${id}`,
      providesTags: (_result, _error, { type, id }) => [
        { type: "SelfServiceFlow", id: `${type}/${id}` },
      ],
    }),
    submitFlow: build.mutation<
      void,
      { action: string; method: string; body: String }
    >({
      query: ({ action, method, body }) => ({
        url: action,
        method,
        body,
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),
    whoami: build.query<Session, void>({
      query: () => `/sessions/whoami`,
      providesTags: () => [{ type: "Session", id: "CURRENT" }],
    }),
  }),
});
