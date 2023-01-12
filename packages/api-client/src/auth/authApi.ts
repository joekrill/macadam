import { appApi } from "../api/appApi";
import {
  PermissionsResponse,
  permissionsResponseSchema,
} from "./schemas/permissions";

export const authApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Permissions"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      /**
       * Returns the rules that define the permissions of the current user.
       */
      permissions: build.query<PermissionsResponse, void>({
        query: () => "user/permissions",
        transformResponse: (result) => permissionsResponseSchema.parse(result),
        providesTags: () => [{ type: "Permissions", id: "CURRENT" }],
      }),
    }),
  });

export const invalidateSession = () =>
  authApi.util.invalidateTags([{ type: "Permissions", id: "CURRENT" }]);
