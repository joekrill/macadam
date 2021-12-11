import { Migration } from "@mikro-orm/migrations";
import { commerce, datatype, date } from "faker";
import { v4 } from "uuid";

export class Migration20211205000000 extends Migration {
  async up(): Promise<void> {
    const namingStrategy = this.config.getNamingStrategy();
    const tableName = namingStrategy.classToTableName("Thing");
    const uuid = "00000000-0000-0000-0000-000000000000";

    this.addSql(
      this.getKnex()
        .table(tableName)
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
