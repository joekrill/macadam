import { useAppSelector } from "../../../app/hooks";
import { useWhoamiQuery } from "../identityApi";
import { selectSession } from "../selectors/selectSession";

export const useIsLoggedIn = () => {
  const whoamiQuery = useWhoamiQuery();
  const session = useAppSelector((state) => selectSession(state));
  return whoamiQuery.isLoading ? undefined : !!session;
};
