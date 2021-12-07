import { Migration } from "@mikro-orm/migrations";
import { v4 } from "uuid";

export class Migration20211205000000 extends Migration {
  async up(): Promise<void> {
    const namingStrategy = this.config.getNamingStrategy();
    const tableName = namingStrategy.classToTableName("Thing");
    const uuid = "00000000-0000-0000-0000-000000000000";
    const date = new Date();

    this.addSql(
      this.getKnex()
        .table(tableName)
        .insert(
          Array.from({ length: 35 }).map((_, i) => ({
            id: v4(),
            created_by: uuid,
            updated_by: uuid,
            created_at: date,
            updated_at: date,
            name: `Thing ${i}`,
            description: `Test description for thing #${i}`,
            private: Math.random() > 0.5,
          }))
        )
        .toQuery()
    );
  }
}
