import {
  AssignOptions,
  CreateOptions,
  EntityClass,
  EntityData,
  EntityDTO,
  FilterQuery,
  FindOptions,
  Loaded,
  RequiredEntityData,
  Utils,
  wrap,
} from "@mikro-orm/core";
import { ParameterizedContext } from "koa";
import {
  OffsetPagination,
  OffsetPaginationOptions,
} from "../features/pagination/OffsetPagination";
import { entitySortFields } from "../features/sorting/entitySortFields";
import { sortStringToOrderBy } from "../features/sorting/sortStringToOrderBy";

export interface ModelListOptions<T> {
  searchable?: boolean;
  paginate?: boolean;
  where?: FilterQuery<T>;
  findOptions?: FindOptions<T>;
}

export abstract class BaseModel<T extends object> {
  constructor(
    readonly ctx: ParameterizedContext,
    readonly entityName: EntityClass<T>
  ) {}

  get textSearchFilter(): string | undefined {
    return undefined;
  }

  get pagination(): OffsetPaginationOptions {
    return OffsetPagination.DefaultOptions;
  }

  get sortableFields(): string[] {
    return entitySortFields(this.entityName, this.ctx.state.entityManager!);
  }

  getUrlSearchParam(key: string) {
    return this.ctx.state.urlSearchParams.get(key);
  }

  async flush() {
    this.ctx.state.entityManager!.flush();
  }

  get orderBy() {
    const sortParam = this.getUrlSearchParam("sort");
    return sortStringToOrderBy(sortParam, this.sortableFields);
  }

  async list({
    findOptions,
    paginate = true,
    searchable,
    where,
  }: ModelListOptions<T> = {}) {
    const em = this.ctx.state.entityManager!;

    const filters: NonNullable<FindOptions<T>["filters"]> = {};

    if (this.textSearchFilter && searchable !== false) {
      filters[this.textSearchFilter] = {
        query: this.getUrlSearchParam("filter[search]"),
      };
    }

    const pagination =
      this.pagination && paginate
        ? new OffsetPagination(this.ctx.state.urlSearchParams, this.pagination)
        : undefined;

    const [entities, total] = await em.findAndCount(
      this.entityName,
      where || ({} as FilterQuery<T>),
      Utils.merge(
        { filters, orderBy: this.orderBy },
        pagination?.findOptions(),
        findOptions
      )
    );

    return {
      entities,
      total,
      pagination: pagination && {
        limit: pagination.limit,
        offset: pagination.offset,
        count: entities.length,
        page: pagination.page,
        totalCount: total,
        totalPages: total && Math.ceil(total / pagination.limit),
      },
    };
  }

  async get(where: FilterQuery<T>, options?: FindOptions<T>) {
    return this.ctx.state.entityManager!.findOneOrFail(
      this.entityName,
      where,
      options
    );
  }

  async create(data: RequiredEntityData<T>, options?: CreateOptions) {
    const entity = await this.ctx.state.entityManager!.create(
      this.entityName,
      data,
      options
    );
    this.ctx.state.entityManager!.persist(entity);
    return entity;
  }

  async update(
    where: FilterQuery<T>,
    data: EntityData<Loaded<T>> | Partial<EntityDTO<Loaded<T>>>,
    options?: AssignOptions | boolean
  ) {
    const entity = await this.get(where);
    this.ctx.state.ability!.ensureCan("update", entity!);
    wrap(entity!).assign(data, options);
    return entity;
  }

  async delete(where: FilterQuery<T>) {
    const entity = this.get(where);
    this.ctx.state.ability!.ensureCan("delete", entity!);
    await this.ctx.state.entityManager?.remove(entity);
  }
}
