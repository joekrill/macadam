import { authApi } from "../auth/authApi";
import {
  ListSessionsParams,
  ListSessionsResponse,
  listSessionsResponseSchema,
} from "./sessionsSchemas";

export const sessionsApi = authApi.injectEndpoints({
  endpoints: (build) => ({
    listSessions: build.query<ListSessionsResponse, ListSessionsParams>({
      query: ({ page = 1, sort } = {}) => ({
        url: "sessions",
        params: {
          "page[number]": page || 1,
          sort,
        },
      }),
      transformResponse: (result) => listSessionsResponseSchema.parse(result),
      providesTags: (result) => [
        ...(result?.data.map(({ id }) => ({
          type: "Session" as const,
          id,
        })) || []),
        { type: "Session" as const, id: "PARTIAL-LIST" },
      ],
    }),

    deleteSession: build.mutation<void, string>({
      query: (id) => ({
        url: `sessions/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, error, id) =>
        !error
          ? [
              { type: "Session", id },
              { type: "Session", id: "PARTIAL-LIST" },
            ]
          : [],
    }),
  }),
});
