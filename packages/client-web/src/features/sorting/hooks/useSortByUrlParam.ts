import { SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DEFAULT_PAGE_PARAM_NAME } from "../../pagination/hooks/usePageUrlParam";
import { useUrlSearchParams } from "../../routing/hooks/useUrlSearchParams";
import { parseSortingRules } from "../parseSortingRules";
import { serializeSortingRules } from "../serializeSortingRule";

export interface UseSortByUrlParamOption {
  /**
   * The URL parameter name to use for specifying the sort.
   */
  paramName?: string;

  /**
   * Additional URL params to remove when changing the sort.
   */
  removeParams?: string[];
}

/**
 * Manages using a URL sort parameter, parsing it into it's rules, and
 * providing the ability to change it's value.
 */
export const useSortByUrlParam = <D>({
  paramName = "sort",
  removeParams = [DEFAULT_PAGE_PARAM_NAME],
}: UseSortByUrlParamOption = {}) => {
  const urlParams = useUrlSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paramValue = urlParams.get(paramName) || undefined;
  const rules = useMemo(
    () => (paramValue ? parseSortingRules(paramValue) : []),
    [paramValue],
  );

  const setRules = useCallback(
    (newRules: SortingState) => {
      const newValue = serializeSortingRules(...newRules);
      if (newValue === paramValue) {
        return;
      }

      if (newValue) {
        urlParams.set(paramName, newValue);
      } else {
        urlParams.delete(paramName);
      }

      // When changing sorting we typically want to reset any pagination
      // parameters.
      removeParams.forEach((p) => urlParams.delete(p));

      navigate({
        pathname,
        search: urlParams.toString(),
      });
    },
    [navigate, paramName, paramValue, pathname, removeParams, urlParams],
  );

  return {
    urlParams,
    setRules,
    rules,
    paramValue,
  };
};
