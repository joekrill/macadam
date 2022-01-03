import { useSession } from "../../auth/hooks/useSession";
import { LoadingSpinner } from "../../common/components/LoadingSpinner/LoadingSpinner";
import { SettingsPageAuthenticated } from "./SettingsPageAuthenticated";
import { SettingsPageUnauthenticated } from "./SettingsPageUnauthenticated";

export const SettingsPage = () => {
  const { isLoggedIn } = useSession();

  if (isLoggedIn === undefined) {
    return <LoadingSpinner />;
  }

  if (isLoggedIn === true) {
    return <SettingsPageAuthenticated />;
  }

  return <SettingsPageUnauthenticated />;
};
