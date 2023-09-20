import { FindOptions } from "@mikro-orm/core";

export interface OffsetPaginationOptions {
  maxLimit: number;
  defaultLimit: number;
  pageNumberKey: string;
  pageSizeKey: string;
}

/**
 * Manages pagination using an page number (offset) and page size (limit).
 */
export class OffsetPagination {
  static readonly DefaultOptions: OffsetPaginationOptions = {
    maxLimit: 30,
    defaultLimit: 10,
    pageNumberKey: "page[number]",
    pageSizeKey: "page[limit]",
  };

  readonly limit: number;
  readonly page: number;
  readonly offset: number;

  constructor(
    params: URLSearchParams,
    options?: Partial<OffsetPaginationOptions>,
  ) {
    const { defaultLimit, maxLimit, pageNumberKey, pageSizeKey } = {
      ...OffsetPagination.DefaultOptions,
      ...options,
    };

    const pageParam = parseInt(params.get(pageNumberKey) || "", 10);
    const limitParam = parseInt(params.get(pageSizeKey) || "", 10);

    this.page = Math.max(1, pageParam || 1);
    this.limit = Math.min(Math.max(0, limitParam || defaultLimit), maxLimit);
    this.offset = (this.page - 1) * this.limit;
  }

  findOptions<T>(): FindOptions<T> {
    return {
      limit: this.limit,
      offset: this.offset,
    };
  }

  meta(count: number, total?: number) {
    return {
      pagination: {
        offset: this.offset,
        limit: this.limit,
        count,
        page: this.page,
        ...(typeof total === "number"
          ? {
              totalCount: total,
              totalPages: Math.ceil(total / this.limit),
            }
          : {}),
      },
    };
  }
}
