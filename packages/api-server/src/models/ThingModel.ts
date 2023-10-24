import { ParameterizedContext } from "koa";
import { z } from "zod";
import { Thing } from "../features/db/entities/Thing.js";
import { BaseModel } from "./BaseModel.js";

const thingCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().nullable().optional(),
  isPublic: z.boolean().default(false), // TODO: any way to extract this from the entity definition?
});

const thingUpdateSchema = thingCreateSchema.extend({
  description: z.string().nullish().default(null),
});

const thingUpdatePartialSchema = thingCreateSchema.extend({
  name: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export class ThingModel extends BaseModel<Thing> {
  constructor(ctx: ParameterizedContext) {
    super(ctx, Thing);
  }

  get textSearchFilter() {
    return "search";
  }

  async get(id: string) {
    return super.get({ id });
  }

  async create(properties: unknown) {
    const thing = await super.create(thingCreateSchema.parse(properties));
    await this.flush();
    return thing;
  }

  async update(id: string, properties: unknown) {
    return await super.update(id, thingUpdateSchema.parse(properties));
  }

  async patch(id: string, properties: unknown) {
    return await super.update(id, thingUpdatePartialSchema.parse(properties));
  }

  async delete(id: string) {
    await super.update(id, { deletedAt: new Date() });
  }
}
