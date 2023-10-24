import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import Koa from "koa";
import pino from "pino";
import request from "supertest";
import { createApp } from "../../app.js";

describe("metricsRoutes", () => {
  describe("GET /metrics", () => {
    let app: Koa;

    beforeEach(async () => {
      app = await createApp({
        environment: "test",
        dbUrl: "sqlite::memory:",
        metricsPath: "/metrics",
        logger: pino({ enabled: false }),
        kratos: {
          publicUrl: "",
          clientUrl: "sqlite::memory:",
        },
      });
    });

    afterEach(async () => {
      await app.context.shutdown();
    });

    describe("initially", () => {
      it("returns a 200", async () => {
        const response = await request(app.callback()).get("/metrics").send();
        expect(response.status).toBe(200);
      });

      it("returns no metrics", async () => {
        const response = await request(app.callback()).get("/metrics").send();
        expect(response.body).toEqual({});
      });
    });
  });
});
