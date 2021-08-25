import { z } from "zod";

export const selfServiceLogoutUrlSchema = z.object({
  logout_url: z.string(),
});
