import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";

export const DEFAULT_PAGE_PARAM_NAME = "page";

export interface UsePageUrlParamOption {
  /**
   * The default page value to use when one isn't specified.
   */
  defaultPage?: number;

  /**
   * The URL parameter name to use for specifying the page.
   */
  paramName?: string;
}

/**
 * Manages using a URL page parameter, parsing and validating it, and
 * providing the ability to change it's value or generate a URL with a
 * different page value.
 */
export const usePageUrlParam = ({
  paramName = DEFAULT_PAGE_PARAM_NAME,
  defaultPage = 1,
}: UsePageUrlParamOption = {}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const urlParams = useUrlSearchParams();

  // By memoizing this value we can later use the same `urlParams` object
  // with `getPageTo` without worrying about mutating it.
  const page = useMemo(() => {
    const value = urlParams.get(paramName) || undefined;
    return (value && parseInt(value, 10)) || defaultPage;
  }, [defaultPage, paramName, urlParams]);

  const getPageTo = useCallback(
    (newPage: number) => {
      if (newPage !== defaultPage) {
        urlParams.set(paramName, String(newPage));
      } else {
        urlParams.delete(paramName);
      }

      return {
        pathname,
        search: urlParams.toString(),
      };
    },
    [defaultPage, paramName, pathname, urlParams]
  );

  const setPage = useCallback(
    (newPage: number) => {
      if (newPage === page) {
        return;
      }

      navigate(getPageTo(newPage));
    },
    [getPageTo, navigate, page]
  );

  return {
    getPageTo,
    setPage,
    page,
  };
};
