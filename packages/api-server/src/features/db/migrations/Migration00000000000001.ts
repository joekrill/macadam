import { faker } from "@faker-js/faker";
import { Migration } from "@mikro-orm/migrations";
import { v4 } from "uuid";

export class Migration00000000000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable("thing", function (table) {
          table.uuid("id").primary();
          table.string("name").notNullable();
          table.string("description");
          table.boolean("is_public").notNullable().defaultTo(false);
          table.uuid("created_by").notNullable();
          table.uuid("updated_by").notNullable();
          table.timestamp("created_at").notNullable();
          table.timestamp("updated_at").notNullable();
          table.timestamp("deleted_at");
        })
        .toQuery(),
    );

    if (process.env.NODE_ENV !== "production") {
      const uuid = "00000000-0000-0000-0000-000000000000";
      this.addSql(
        this.getKnex()
          .table("thing")
          .insert(
            Array.from({ length: 35 }).map((_, i) => ({
              id: v4(),
              created_by: uuid,
              updated_by: uuid,
              created_at: faker.date.past(),
              updated_at: faker.date.recent(),
              name: faker.commerce.productName(),
              description: faker.commerce.productDescription(),
              is_public: faker.datatype.boolean(),
            })),
          )
          .toQuery(),
      );
    }
  }
}
