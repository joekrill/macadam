import { Database, Resource } from "@adminjs/mikroorm";
import { buildRouter } from "@eflexsystems/adminjs-koa";
import AdminJS from "adminjs";
import { createApp } from "./app";
import { config } from "./config";
import { notFound } from "./features/errors/notFound";
import { serve } from "./serve";

(async () => {
  const app = await createApp({ appName: "admin-server", ...config });

  AdminJS.registerAdapter({ Database, Resource });
  const adminJs = new AdminJS({
    databases: [app.context.db.orm, app.context.kratos.orm],
    // rootPath: "/",
    branding: {
      companyName: "Macadam",
      // softwareBrothers
    },
  });
  const router = buildRouter(adminJs, app);
  app.use(router.routes()).use(router.allowedMethods());

  app.use(notFound());

  serve(app, config.port, config.hostname);
})();
