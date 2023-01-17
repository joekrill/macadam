import { useMemo } from "react";
import { Mock, vi } from "vitest";
import { usePaginationPages } from "./usePaginationPages";

vi.mock("react");

beforeEach(() => {
  (useMemo as Mock).mockImplementation((cb) => cb());
});

test.each([
  // Small number of pages
  [{ currentPage: 1, totalPages: 1, maxSiblings: 0 }, [1]],
  [{ currentPage: 1, totalPages: 2, maxSiblings: 0 }, [1, 2]],
  [{ currentPage: 1, totalPages: 3, maxSiblings: 0 }, [1, 2, 3]],
  [{ currentPage: 1, totalPages: 4, maxSiblings: 0 }, [1, -1, 4]],
  [{ currentPage: 2, totalPages: 2, maxSiblings: 0 }, [1, 2]],
  [{ currentPage: 2, totalPages: 3, maxSiblings: 0 }, [1, 2, 3]],
  [{ currentPage: 1, totalPages: 1, maxSiblings: 1 }, [1]],
  [{ currentPage: 1, totalPages: 2, maxSiblings: 1 }, [1, 2]],
  [{ currentPage: 1, totalPages: 3, maxSiblings: 1 }, [1, 2, 3]],
  [{ currentPage: 1, totalPages: 4, maxSiblings: 1 }, [1, 2, 3, 4]],
  [{ currentPage: 1, totalPages: 5, maxSiblings: 1 }, [1, 2, -1, 5]],
  [{ currentPage: 1, totalPages: 6, maxSiblings: 1 }, [1, 2, -1, 6]],
  [{ currentPage: 4, totalPages: 5, maxSiblings: 1 }, [1, 2, 3, 4, 5]],
  [{ currentPage: 5, totalPages: 5, maxSiblings: 1 }, [1, -1, 4, 5]],
  [{ currentPage: 6, totalPages: 6, maxSiblings: 1 }, [1, -1, 5, 6]],
  [
    { currentPage: 10, totalPages: 30, maxSiblings: 4 },
    [1, -1, 6, 7, 8, 9, 10, 11, 12, 13, 14, -1, 30],
  ],
  [
    { currentPage: 10, totalPages: 30, maxSiblings: 1 },
    [1, -1, 9, 10, 11, -1, 30],
  ],
  [
    { currentPage: 13, totalPages: 40, maxSiblings: 4 },
    [1, -1, 9, 10, 11, 12, 13, 14, 15, 16, 17, -1, 40],
  ],

  // without totalPages
  [{ currentPage: 10, maxSiblings: 4 }, [1, -1, 6, 7, 8, 9, 10, 11, -1]],
  [{ currentPage: 1, maxSiblings: 10 }, [1, 2, -1]],
  [
    { currentPage: 11, maxSiblings: 10 },
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, -1],
  ],

  // currentPage out of range
  [{ currentPage: 10, totalPages: 3, maxSiblings: 1 }, [1, 2, 3]],
  [{ currentPage: 100, totalPages: 10, maxSiblings: 2 }, [1, -1, 8, 9, 10]],
  [{ currentPage: -3, totalPages: 3, maxSiblings: 1 }, [1, 2, 3]],
  [{ currentPage: -3, totalPages: 10, maxSiblings: 2 }, [1, 2, 3, -1, 10]],
  [{ currentPage: -40, maxSiblings: 1 }, [1, -1]],
  [{ currentPage: 0, maxSiblings: 2 }, [1, -1]],
])("usePagination(%j)", (args, expected) => {
  expect(usePaginationPages(args)).toEqual(expected);
});
