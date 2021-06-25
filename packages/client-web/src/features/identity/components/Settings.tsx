import { SelfService } from "./SelfService";

// NOTE: Settings is currently broken when they are submitted with a field
// that has an error. https://github.com/ory/kratos/issues/1425
export const Settings = () => (
  <SelfService flowType="settings" title="Settings" />
);
