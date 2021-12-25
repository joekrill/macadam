import { z } from "zod";

// TODO: customize based on current traits.
export const traitsSchema = z.object({
  name: z.string().nullish(),
  email: z.string().nullish(),
  locale: z.string().nullish(),
  picture: z.string().nullish(),
});
