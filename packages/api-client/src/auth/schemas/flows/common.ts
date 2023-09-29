import { z } from "zod";
import { uiContainerSchema } from "./ui";

export type InitializeFlowParams = {
  returnTo?: string;
  clientType?: "browser" | "api";
};

export const flowTypeSchema = z.union([z.literal("api"), z.literal("browser")]);

export const flowCommonSchema = z.object({
  active: z.string().optional(),

  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user wishes to continue, a new flow has to be initiated.
   */
  expires_at: z.string(),

  id: z.string(),

  /**
   * IssuedAt is the time (UTC) when the flow started.
   */
  issued_at: z.string(),

  request_url: z.string(),

  /**
   * ReturnTo contains the requested return_to URL.
   */
  return_to: z.string().optional(),

  /**
   * The flow type can either be `api` or `browser`.
   */
  type: flowTypeSchema,

  ui: uiContainerSchema,
});
