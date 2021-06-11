import { Migration } from "@mikro-orm/migrations";

export class Migration20210610004441 extends Migration {
  async up(): Promise<void> {
    const namingStrategy = this.config.getNamingStrategy();
    const tableName = namingStrategy.classToTableName("Thing");

    this.addSql(
      this.getKnex()
        .schema.createTable(tableName, function (table) {
          table.uuid(namingStrategy.propertyToColumnName("id")).primary();
          table.string(namingStrategy.propertyToColumnName("name"));
          table.timestamp(namingStrategy.propertyToColumnName("createdAt"));
          table.timestamp(namingStrategy.propertyToColumnName("updatedAt"));
        })
        .toQuery()
    );
  }
}
