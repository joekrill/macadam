import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import Koa from "koa";
import request from "supertest";
import { createApp } from "../../app.js";
import { createAppTestOptions } from "../../test/createAppTestOptions.js";

describe("metricsRoutes", () => {
  describe("GET /metrics", () => {
    let app: Koa;

    beforeEach(async () => {
      app = await createApp({
        ...createAppTestOptions,
        metricsPath: "/metrics",
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
