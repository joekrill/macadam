import { createApp } from "./app";
import { config } from "./config";
import { notFound } from "./features/errors/notFound";
import { apiRoutes } from "./routes";
import { serve } from "./serve";

(async () => {
  const app = await createApp({ appName: "api-server", ...config });

  // Lastly, register API routes
  app.use(apiRoutes({ prefix: "/api" }));
  app.use(notFound());

  serve(app, config.port, config.hostname);
})();
