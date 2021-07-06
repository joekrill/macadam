import pino from "pino";
import request from "supertest";
import { AppInstance, createApp } from "../../app";

jest.unmock("prom-client");

describe("metrics", () => {
  describe("GET /metrics", () => {
    let app: AppInstance;

    beforeEach(async () => {
      app = await createApp({
        environment: "test",
        dbUrl: "sqlite::memory:",
        metricsPath: "/metrics",
        logger: pino(),
      });
    });

    afterEach(async () => {
      await app.shutdown();
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
