import { appApi } from "../api/appApi";
import { SubmitContactUsParams } from "./contactUsSchemas";

export const contactUsApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    submitContactUs: build.mutation<void, SubmitContactUsParams>({
      query: (body) => ({
        url: "contact-us",
        method: "POST",
        body,
      }),
    }),
  }),
});
