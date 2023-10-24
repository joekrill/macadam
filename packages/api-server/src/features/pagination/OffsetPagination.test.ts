import { describe, expect, it } from "@jest/globals";
import { FindOptions } from "@mikro-orm/core";
import {
  OffsetPagination,
  OffsetPaginationOptions,
} from "./OffsetPagination.js";

describe.each<
  [
    string,
    {
      searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
      options?: Partial<OffsetPaginationOptions>;
      expectedFindOptions: FindOptions<any>;
      metaParams: [number, number | undefined];
      expectedMeta: any;
    },
  ]
>([
  [
    "defaults",
    {
      expectedFindOptions: { limit: 10, offset: 0 } as FindOptions<any>,
      metaParams: [10, 123],
      expectedMeta: expect.objectContaining({
        offset: 0,
        limit: 10,
        count: 10,
        page: 1,
        totalCount: 123,
        totalPages: 13,
      }),
    },
  ],
  [
    "no total",
    {
      expectedFindOptions: { limit: 10, offset: 0 } as FindOptions<any>,
      metaParams: [10, undefined],
      expectedMeta: {
        offset: 0,
        limit: 10,
        count: 10,
        page: 1,
      },
    },
  ],
  [
    "limit over maximum",
    {
      searchParams: { "page[limit]": "100" },
      options: { maxLimit: 20 },
      expectedFindOptions: { limit: 20, offset: 0 } as FindOptions<any>,
      metaParams: [20, 30],
      expectedMeta: {
        offset: 0,
        limit: 20,
        count: 20,
        page: 1,
        totalPages: 2,
        totalCount: 30,
      },
    },
  ],
])(
  "%s",
  (
    _,
    { searchParams, options, expectedFindOptions, metaParams, expectedMeta },
  ) => {
    const pagination = new OffsetPagination(
      new URLSearchParams(searchParams),
      options,
    );

    it("has expected findOptions()", () => {
      expect(pagination.findOptions()).toEqual(expectedFindOptions);
    });

    it("has expected meta()", () => {
      expect(pagination.meta(...metaParams)).toEqual({
        pagination: expectedMeta,
      });
    });
  },
);
