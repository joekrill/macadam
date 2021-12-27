import { Migration } from "@mikro-orm/migrations";
import { commerce, datatype, date } from "faker";
import { v4 } from "uuid";

export class Migration00000000000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable("thing", function (table) {
          table.uuid("id").primary();
          table.string("name").notNullable();
          table.string("description");
          table.boolean("is_private").notNullable().defaultTo(true);
          table.uuid("created_by").notNullable();
          table.uuid("updated_by").notNullable();
          table.timestamp("created_at").notNullable();
          table.timestamp("updated_at").notNullable();
          table.timestamp("deleted_at");
        })
        .toQuery()
    );

    const uuid = "00000000-0000-0000-0000-000000000000";
    this.addSql(
      this.getKnex()
        .table("thing")
        .insert(
          Array.from({ length: 35 }).map((_, i) => ({
            id: v4(),
            created_by: uuid,
            updated_by: uuid,
            created_at: date.past(),
            updated_at: date.recent(),
            name: commerce.productName(),
            description: commerce.productDescription(),
            is_private: datatype.boolean(),
          }))
        )
        .toQuery()
    );
  }
}
