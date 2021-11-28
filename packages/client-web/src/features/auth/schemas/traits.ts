import { z } from "zod";

// TODO: customize based on current traits.
export const traitsSchema = z.object({
  name: z
    .object({
      first: z.string().nullish(),
      last: z.string().nullish(),
    })
    .nullish(),
  email: z.string(),
  picture: z.string().nullish(),
});
