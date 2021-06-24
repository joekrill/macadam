import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useWhoamiQuery } from "../identityApi";

export interface UseRedirectOnLoginParams {
  defaultLocation?: string;
}

export const useRedirectOnLogin = ({ defaultLocation = "/" } = {}) => {
  const { isSuccess } = useWhoamiQuery();
  const history = useHistory();
  const location = useLocation<{ from?: Location }>();

  useEffect(() => {
    if (isSuccess) {
      history.replace(
        location.state?.from || {
          pathname: defaultLocation,
        }
      );
    }
  }, [isSuccess, history, location.state?.from]);
};
