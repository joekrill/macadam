import pino from "pino";
import request from "supertest";
import { AppInstance, createApp } from "../../app";

describe("/health", () => {
  let app: AppInstance;

  beforeEach(async () => {
    app = await createApp({
      environment: "test",
      dbUrl: "sqlite::memory:",
      healthPath: "/health",
      logger: pino({ enabled: false }),
      kratosPublicUrl: "",
    });
  });

  afterEach(async () => {
    await app.shutdown();
  });

  describe("GET", () => {
    it("returns a 200", async () => {
      const response = await request(app.callback()).get("/health").send();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("when terminating", () => {
    beforeEach(() => {
      app.context.isTerminating = true;
    });

    it("returns a 503", async () => {
      const response = await request(app.callback()).get("/health").send();
      expect(response.status).toBe(503);
    });

    it("sets a `Connection: close` header", async () => {
      const response = await request(app.callback()).get("/health").send();
      expect(response.headers["connection"]).toEqual("close");
    });
  });
});
