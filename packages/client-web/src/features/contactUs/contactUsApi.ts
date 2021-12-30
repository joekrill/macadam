import { appApi } from "../api/appApi";
import { SubmitContactUsParams } from "./contactUsSchemas";

export const contactUsApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    submitContactUs: build.mutation<void, SubmitContactUsParams>({
      query: (body) => ({
        url: "dev/status/200",
        // url: "contact-us",
        method: "POST",
        body,
      }),
    }),
  }),
});
