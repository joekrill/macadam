import { Settings } from "../components/flows/settings/Settings";
import { RequireAuthenticated } from "../components/RequireAuthenticated";
import { useAuthPageParams } from "./useAuthPageParams";

export interface SettingsPageProps {}

export const SettingsPage = () => {
  const { aal: _aal, refresh: _referesh, ...params } = useAuthPageParams();

  return (
    <RequireAuthenticated>
      <Settings {...params} />
    </RequireAuthenticated>
  );
};
