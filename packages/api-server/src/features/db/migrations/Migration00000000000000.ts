import { Migration } from "@mikro-orm/migrations";

export class Migration00000000000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable("audit_log", function (table) {
          table.uuid("id").primary();
          table.timestamp("created_at").notNullable();
          table.uuid("user_id");
          table.string("entity_type");
          table.string("entity_id");
          table.string("action");
          table.jsonb("context");
          table.jsonb("changes");
          table.jsonb("before");
          table.jsonb("after");
        })
        .toQuery()
    );
  }
}
