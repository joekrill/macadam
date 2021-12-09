import { appApi } from "../api/appApi";
import {
  CreateThingParams,
  CreateThingResponse,
  createThingResponseSchema,
  GetThingResponse,
  getThingResponseSchema,
  ListThingsParams,
  ListThingsResponse,
  listThingsResponseSchema,
  UpdateThingParams,
  UpdateThingResponse,
  updateThingResponseSchema,
} from "./thingsSchemas";

export const thingsApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Thing"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      listThings: build.query<ListThingsResponse, ListThingsParams>({
        query: ({ page, owned } = {}) => ({
          url: "things",
          params: {
            ...(page ? { "page[number]": page } : {}),
            ...(owned ? { "filter[owned]": 1 } : {}),
          },
        }),
        transformResponse: (result) => listThingsResponseSchema.parse(result),
        providesTags: (result) =>
          result
            ? [
                // Provides a tag for each post in the current page,
                // as well as the 'PARTIAL-LIST' tag.
                ...result.data.map(({ id }) => ({
                  type: "Thing" as const,
                  id,
                })),
                { type: "Thing", id: "PARTIAL-LIST" },
              ]
            : [{ type: "Thing", id: "PARTIAL-LIST" }],
      }),
      getThing: build.query<GetThingResponse, string>({
        query: (id) => `things/${encodeURIComponent(id)}`,
        transformResponse: (result) => getThingResponseSchema.parse(result),
        providesTags: (result) =>
          result ? [{ type: "Thing", id: result.data.id }] : [],
      }),
      createThing: build.mutation<CreateThingResponse, CreateThingParams>({
        query: (thing) => ({
          url: "things",
          method: "POST",
          body: thing,
        }),
        transformResponse: (result) => createThingResponseSchema.parse(result),
        invalidatesTags: (result, _error, id) =>
          result ? [{ type: "Thing", id: "PARTIAL-LIST" }] : [],
      }),
      updateThing: build.mutation<UpdateThingResponse, UpdateThingParams>({
        query: ({ id, ...thing }) => ({
          url: `things/${encodeURIComponent(id)}`,
          method: "PATCH",
          body: thing,
        }),
        transformResponse: (result) => updateThingResponseSchema.parse(result),
        invalidatesTags: (result, _error, { id }) =>
          result
            ? [
                { type: "Thing", id },
                { type: "Thing", id: "PARTIAL-LIST" },
              ]
            : [],
      }),
      deleteThing: build.mutation<void, string>({
        query: (id) => ({
          url: `things/${encodeURIComponent(id)}`,
          method: "DELETE",
        }),
        invalidatesTags: (_result, error, id) =>
          !error
            ? [
                { type: "Thing", id },
                { type: "Thing", id: "PARTIAL-LIST" },
              ]
            : [],
      }),
    }),
  });
