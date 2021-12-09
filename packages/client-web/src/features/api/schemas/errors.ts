import { z } from "zod";
import { linkSchema } from "./links";

export const errorSchema = z.object({
  id: z.string().optional(),
  links: z.record(linkSchema).optional(),
  status: z.string().optional(),
  code: z.number().optional(),
  title: z.string().optional(),
  detail: z.string().optional(),
});
