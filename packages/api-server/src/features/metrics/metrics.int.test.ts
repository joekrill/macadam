import Koa from "koa";
import pino from "pino";
import request from "supertest";
import { createApp } from "../../app";

jest.unmock("prom-client");

describe("metrics", () => {
  describe("GET /metrics", () => {
    let app: Koa;

    beforeEach(async () => {
      app = await createApp({
        environment: "test",
        dbUrl: "sqlite::memory:",
        metricsPath: "/metrics",
        logger: pino(),
      });
    });

    afterEach(() => {
      app.emit("shutdown");
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
