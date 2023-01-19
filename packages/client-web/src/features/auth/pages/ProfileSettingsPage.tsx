import { Settings } from "../components/flows/settings/Settings";
import { useAuthPageParams } from "./useAuthPageParams";

export interface ProfileSettingsPageProps {}

export const ProfileSettingsPage = () => {
  const { aal: _aal, refresh: _referesh, ...params } = useAuthPageParams();

  return <Settings {...params} />;
};
