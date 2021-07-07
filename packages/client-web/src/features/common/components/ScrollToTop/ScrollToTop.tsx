import { useEffect } from "react";
import { useLocation } from "react-router";

export interface ScrollToTopProps {
  /**
   * `true` to scroll to top when navigating to a different path. Otherwise
   * will scroll to top only when the component is first mounted.
   */
  navigate?: boolean;
}

export const ScrollToTop = ({ navigate = false }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(
    () => {
      window.scrollTo(0, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    navigate ? [pathname] : []
  );

  return null;
};
