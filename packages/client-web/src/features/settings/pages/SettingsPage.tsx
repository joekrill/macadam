import { Skeleton } from "@chakra-ui/react";
import { useSession } from "../../auth/hooks/useSession";
import { SettingsPageAuthenticated } from "./SettingsPageAuthenticated";
import { SettingsPageUnauthenticated } from "./SettingsPageUnauthenticated";

export const SettingsPage = () => {
  const { isLoggedIn } = useSession();

  return (
    <Skeleton isLoaded={isLoggedIn !== undefined}>
      {isLoggedIn === true ? (
        <SettingsPageAuthenticated />
      ) : (
        <SettingsPageUnauthenticated />
      )}
    </Skeleton>
  );
};
