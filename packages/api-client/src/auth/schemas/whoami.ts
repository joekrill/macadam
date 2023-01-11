import { z } from "zod";
import { sessionSchema } from "./session";

export const whoamiResponseSchema = sessionSchema;

export type WhoamiResponse = z.infer<typeof whoamiResponseSchema>;
