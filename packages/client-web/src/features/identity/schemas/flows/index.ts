import { z } from "zod";
import { selfServiceLoginFlowSchema } from "./login";
import { selfServiceRecoveryFlowSchema } from "./recovery";
import { selfServiceRegistrationFlowSchema } from "./registration";
import { selfServiceSettingsFlowSchema } from "./settings";
import { UiContainer } from "./ui";
import { selfServiceVerificationFlowSchema } from "./verification";

export type SelfServiceFlowName =
  | "login"
  | "registration"
  | "recovery"
  | "verification"
  | "settings";

export const hasError = (ui: UiContainer, error: number) => {
  return ui.messages?.some(({ id }) => id === error) || false;
};

export const selfServiceFlowSchema = z.union([
  selfServiceLoginFlowSchema,
  selfServiceRegistrationFlowSchema,
  selfServiceVerificationFlowSchema,
  selfServiceRecoveryFlowSchema,
  selfServiceSettingsFlowSchema,
]);

export type SelfServiceFlow = z.infer<typeof selfServiceFlowSchema>;
