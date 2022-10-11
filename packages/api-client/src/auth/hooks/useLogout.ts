import { useCallback } from "react";
// import { trackEvent } from "../../analytics";
import { identityApi } from "../identityApi";

export interface UseLogoutOptions {
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onLogoutComplete?: () => void;
}

export const useLogout = ({
  onClick,
  onLogoutComplete,
}: UseLogoutOptions = {}) => {
  const [createUrl, urlResult] = identityApi.useCreateLogoutUrlMutation();
  const [logout, logoutResult] = identityApi.useLogoutMutation();

  const trigger = useCallback(() => {
    return createUrl().then((result) => {
      if ("data" in result) {
        return logout(result.data);
      }
    });
  }, [createUrl, logout]);

  const onClickHandler = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (onClick) {
        onClick(e);
      }

      if (!e.defaultPrevented) {
        trigger().then(() => {
          // trackEvent("Logout");

          if (onLogoutComplete) {
            onLogoutComplete();
          }
        });
      }
    },
    [onClick, onLogoutComplete, trigger]
  );

  return {
    trigger,
    isLoading: logoutResult.isLoading || urlResult.isLoading,
    onClick: onClickHandler,
  };
};
