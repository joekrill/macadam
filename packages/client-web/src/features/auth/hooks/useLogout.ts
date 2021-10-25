import { useCallback } from "react";
import { identityApi } from "../identityApi";

export const useLogout = () => {
  const [createUrl, urlResult] = identityApi.useCreateLogoutUrlMutation();
  const [logout, logoutResult] = identityApi.useLogoutMutation();

  const trigger = useCallback(() => {
    return createUrl().then((result) => {
      if ("data" in result) {
        return logout(result.data);
      }
    });
  }, [createUrl, logout]);

  return {
    trigger,
    isPending: logoutResult.isLoading || urlResult.isLoading,
  };
};
