import { useMemo } from "react";

export const createRange = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

export const SPACER = -1;

export interface UsePaginationOptions {
  currentPage: number;
  totalPages?: number;
  maxSiblings: number;
}

/**
 * Returns an array of pages to render given the current page being displayed
 * (`currentPage`), total available pages (`totalPages`) if known, and the
 * desired number of buttons to show on each side of the current page
 * (`maxSiblings`).
 *
 * A negative number indicates a "spacer" - a break in the continuity of the range.
 */
export const usePagination = ({
  currentPage, //-40
  maxSiblings, //1
  totalPages,
}: UsePaginationOptions) =>
  useMemo(() => {
    if (totalPages === 0) {
      return [currentPage];
    }

    // Minimum gap between numbers for a spacer, otherwise we don't want a gap
    // If we allowed a smaller gap, we could replace just one number with a
    // spacer - which isn't saving us any space, we might as well just
    // include the number.
    const minGap = 3;

    // Always show first and last pages.
    const first = 1;
    const last = totalPages || Math.max(1, currentPage + 1);

    // Ensure inputs are in the expected range
    const current = Math.min(last, Math.max(1, currentPage)); //10
    const siblings = Math.max(0, maxSiblings); //2

    // "middle range" (the range around the current page buffered by
    // maxSiblings) without accounting for minimum gap.
    const innerMin = Math.min(last, Math.max(first, current - siblings)); //8
    const innerMax = Math.min(last, current + siblings); //10

    // The actual range to create, making sure we won't have a gap of less
    // than minGap numbers.
    const start = innerMin - first < minGap ? first : innerMin;
    const end = last - innerMax < minGap ? last : innerMax;

    const range = createRange(start, end);

    if (start !== first) {
      // If the range doesn't include the first page, add it, plus a spacer
      range.unshift(1, SPACER);
    }

    if (!totalPages || end !== last) {
      // If we don't know the total pages, or if the range doesn't include the
      // last page, include a gap.
      range.push(SPACER);

      if (totalPages) {
        // if we know the total pages, include that. Otherwise we end on a gap
        range.push(totalPages);
      }
    }

    return range;
  }, [currentPage, maxSiblings, totalPages]);
