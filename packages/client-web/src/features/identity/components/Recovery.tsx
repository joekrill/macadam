import { SelfService } from "./SelfService";

// TODO: Handle recovery flow correctly.
export const Recovery = () => (
  <SelfService flowType="recovery" title="Reset Password" />
);
