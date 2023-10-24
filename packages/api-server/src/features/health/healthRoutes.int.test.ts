import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import Koa from "koa";
import pino from "pino";
import request from "supertest";
import { createApp } from "../../app.js";

describe("/health", () => {
  let app: Koa;

  beforeEach(async () => {
    app = await createApp({
      environment: "test",
      dbUrl: "sqlite::memory:",
      healthPath: "/health",
      logger: pino({ enabled: false }),
      kratosPublicUrl: "",
      kratosDbUrl: "sqlite::memory:",
    });
  });

  afterEach(async () => {
    await app.context.shutdown();
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
