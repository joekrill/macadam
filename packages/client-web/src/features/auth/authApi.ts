import { appApi } from "../api/appApi";
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
    }),
  });

export const invalidateSession = () =>
  authApi.util.invalidateTags([{ type: "Session", id: "CURRENT" }]);

export const { useWhoamiQuery } = authApi;
