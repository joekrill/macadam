import { appApi } from "../api/appApi";
import {
  ListSessionsParams,
  ListSessionsResponse,
  listSessionsResponseSchema,
} from "./schemas/session";
import { WhoamiResponse, whoamiResponseSchema } from "./schemas/whoami";

export const authApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Session"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      /**
       * The whoami andpoint uses the api-server, because we augment it with
       * some additional data (rules)
       */
      whoami: build.query<WhoamiResponse, void>({
        query: () => "users/whoami",
        transformResponse: (result) => whoamiResponseSchema.parse(result),
        providesTags: () => [{ type: "Session", id: "CURRENT" }],
      }),

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

export const invalidateSession = () =>
  authApi.util.invalidateTags([{ type: "Session", id: "CURRENT" }]);

export const { useWhoamiQuery } = authApi;
