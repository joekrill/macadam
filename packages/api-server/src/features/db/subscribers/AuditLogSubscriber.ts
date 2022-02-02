import { EventSubscriber, FlushEventArgs } from "@mikro-orm/core";
import { AuditLog } from "../entities/AuditLog";

export class AuditLogSubscriber implements EventSubscriber {
  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const user = args.em.getFilterParams("user");
    const auditContext = args.em.getFilterParams("auditContext");

    changeSets.forEach((cs, i) => {
      if ("disableAudit" in cs.entity?.constructor) {
        return;
      }

      if (cs.name === AuditLog.constructor.name) {
        // Don't audit the AuditLog!
        return;
      }

      const auditLog = new AuditLog(cs);
      auditLog.userId = user?.id as string;
      auditLog.context = auditContext;
      args.uow.computeChangeSet(auditLog);
    });
  }
}
