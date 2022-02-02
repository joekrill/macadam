import {
  ChangeSetType,
  EventSubscriber,
  FlushEventArgs,
} from "@mikro-orm/core";

export class TimestampSubscriber implements EventSubscriber {
  async onFlush(args: FlushEventArgs): Promise<void> {
    const changeSets = args.uow.getChangeSets();
    const user = args.em.getFilterParams("user");
    const userId = typeof user?.id === "string" ? user?.id : undefined;
    const now = new Date();

    changeSets.forEach((cs) => {
      if ("disableTimestamping" in cs.entity?.constructor) {
        return;
      }

      if (cs.type === ChangeSetType.DELETE) {
        return;
      }

      let changed = false;

      if (cs.type === ChangeSetType.CREATE) {
        if ("createdAt" in cs.entity) {
          cs.entity.createdAt = now;
          changed = true;
        }

        if ("createdBy" in cs.entity && userId) {
          cs.entity.createdBy = user?.id as string;
          changed = true;
        }
      }

      if (
        cs.type === ChangeSetType.CREATE ||
        cs.type === ChangeSetType.UPDATE
      ) {
        if ("updatedAt" in cs.entity) {
          cs.entity.updatedAt = now;
          changed = true;
        }

        if ("updatedBy" in cs.entity && userId) {
          cs.entity.updatedBy = user?.id as string;
          changed = true;
        }
      }

      if (changed) {
        args.uow.recomputeSingleChangeSet(cs.entity);
      }
    });
  }
}
