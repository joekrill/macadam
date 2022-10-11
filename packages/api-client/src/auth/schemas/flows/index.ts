import { z } from "zod";
import { loginFlowSchema } from "./login";
import { recoveryFlowSchema } from "./recovery";
import { registrationFlowSchema } from "./registration";
import { settingsFlowSchema } from "./settings";
import { UiContainer } from "./ui";
import { verificationFlowSchema } from "./verification";

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
  loginFlowSchema,
  registrationFlowSchema,
  verificationFlowSchema,
  recoveryFlowSchema,
  settingsFlowSchema,
]);

export type SelfServiceFlow = z.infer<typeof selfServiceFlowSchema>;
