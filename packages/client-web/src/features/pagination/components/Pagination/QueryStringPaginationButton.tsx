import { useMemo } from "react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { DEFAULT_PAGE_PARAM_NAME } from "../../hooks/usePageUrlParam";
import { PaginationButton, PaginationButtonProps } from "./PaginationButton";

export interface QueryStringPaginationButtonProps
  extends PaginationButtonProps {
  pageParameter?: string;
}

/**
 * A pagination button implementation that uses query string parametesr
 * to specify the desired page.
 */
export const QueryStringPaginationButton = ({
  pageNumber,
  pageParameter = DEFAULT_PAGE_PARAM_NAME,
  ...props
}: QueryStringPaginationButtonProps) => {
  const location = useLocation();

  const search = useMemo(() => {
    const urlSearchParams = new URLSearchParams(location.search);

    if (pageNumber > 1) {
      urlSearchParams.set(pageParameter, String(pageNumber));
    } else {
      urlSearchParams.delete(pageParameter);
    }

    return urlSearchParams.toString();
  }, [location.search, pageParameter, pageNumber]);

  return (
    <PaginationButton
      pointerEvents={props.isDisabled ? "none" : undefined}
      {...props}
      pageNumber={pageNumber}
      as={ReactRouterLink}
      to={{
        ...location,
        search,
      }}
    />
  );
};
