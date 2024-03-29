import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { createApp } from "../../../app.js";
import { createAppTestOptions } from "../../../test/createAppTestOptions.js";

let app: Awaited<ReturnType<typeof createApp>>;

beforeEach(async () => {
  app = await createApp(createAppTestOptions);
});

afterEach(async () => {
  await app.context.shutdown();
});

describe("GET /status", () => {
  describe.each([
    [400, 400, "Bad Request"],
    [421, 421, "Misdirected Request"],
    [499, 499, "Bad Request"],
    [500, 500, "Internal Server Error"],
  ])("error '%s'", (requestStatus, status, message) => {
    it("should echo the status", async () => {
      const response = await request(app.callback())
        .get(`/api/v1/dev/status/${requestStatus}`)
        .accept("application/json")
        .send();
      expect(response.status).toBe(status);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            message,
          }),
        }),
      );
    });
  });

  describe.each([
    [200, 200, "OK"],
    [201, 201, "Created"],
    [300, 300, "Multiple Choices"],
  ])("success '%s'", (requestStatus, status, message) => {
    it("should echo the status", async () => {
      const response = await request(app.callback())
        .get(`/api/v1/dev/status/${requestStatus}`)
        .accept("application/json")
        .send();
      expect(response.status).toBe(status);
      expect(response.body).toEqual(
        expect.objectContaining({
          message,
        }),
      );
    });
  });

  describe.each([
    -10,
    0,
    50,
    100,
    101,
    600,
    700,
    800,
    900,
    1000,
    "abc",
    "Foobar",
  ])("invalid code '%s'", (requestStatus) => {
    it("should return 404", async () => {
      const response = await request(app.callback())
        .get(`/api/v1/dev/status/${requestStatus}`)
        .accept("application/json")
        .send();
      expect(response.status).toBe(404);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Not Found",
          }),
        }),
      );
    });
  });
});
