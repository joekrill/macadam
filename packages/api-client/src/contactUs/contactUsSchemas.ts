import { z } from "zod";

export const submitContactUsParamsSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});

export type SubmitContactUsParams = z.infer<typeof submitContactUsParamsSchema>;
