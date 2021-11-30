import { Migration } from "@mikro-orm/migrations";

export class Migration20210826111543 extends Migration {
  async up(): Promise<void> {
    const namingStrategy = this.config.getNamingStrategy();
    const tableName = namingStrategy.classToTableName("UserPreference");

    this.addSql(
      this.getKnex()
        .schema.createTable(tableName, function (table) {
          table.uuid(namingStrategy.propertyToColumnName("id")).primary();
          table
            .timestamp(namingStrategy.propertyToColumnName("createdAt"))
            .notNullable();
          table
            .timestamp(namingStrategy.propertyToColumnName("updatedAt"))
            .notNullable();
          table.jsonb(namingStrategy.propertyToColumnName("preferences"));
        })
        .toQuery()
    );
  }
}
