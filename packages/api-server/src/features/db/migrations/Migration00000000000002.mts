import { Migration } from "@mikro-orm/migrations";

export class Migration00000000000002 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      this.getKnex()
        .schema.createTable("contact_us_message", function (table) {
          table.uuid("id").primary();
          table.timestamp("created_at").notNullable();
          table.timestamp("updated_at").notNullable();
          table.timestamp("last_status_at");
          table.uuid("sent_by");
          table.string("ip_address");
          table.string("user_agent");
          table.string("name");
          table.string("from");
          table.string("message");
          table.string("status");
          table.string("error");
        })
        .toQuery(),
    );
  }
}
