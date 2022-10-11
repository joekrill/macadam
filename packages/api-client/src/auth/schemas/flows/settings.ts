import { z } from "zod";
import { identitySchema } from "../identity";
import { flowCommonSchema } from "./common";

/**
 * This flow is used when an identity wants to update settings (e.g. profile data, passwords, ...) in a selfservice manner.  We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
 */
export const settingsFlowSchema = flowCommonSchema.extend({
  identity: identitySchema,
  state: z.union([z.literal("show_form"), z.literal("success")]),
});

export type SettingsFlow = z.infer<typeof settingsFlowSchema>;
