import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { RequireAuthenticated } from "../components/RequireAuthenticated";
import { Settings } from "../components/settings/Settings";

export interface SettingsPageProps {}

export const SettingsPage = () => {
  const params = useUrlSearchParams();

  return (
    <RequireAuthenticated>
      <Settings
        flowId={params.get("flow") || undefined}
        returnTo={params.get("return_to") || undefined}
      />
    </RequireAuthenticated>
  );
};
