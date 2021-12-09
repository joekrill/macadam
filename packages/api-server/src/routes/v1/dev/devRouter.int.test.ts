import pino from "pino";
import request from "supertest";
import { UnwrapPromise } from "../../../@types/UnwrapPromise";
import { createApp } from "../../../app";

let app: UnwrapPromise<ReturnType<typeof createApp>>;

beforeEach(async () => {
  app = await createApp({
    environment: "test",
    dbUrl: "sqlite::memory:",
    logger: pino({ enabled: false }),
    kratosPublicUrl: "",
    kratosDbUrl: "sqlite::memory:",
  });
});

afterEach(async () => {
  await app.context.shutdown();
});

describe.each([
  [-10, 500, "-10"],
  [0, 500, "0"],
  [50, 500, "50"],
  [100, 500, "Continue"],
  [101, 500, "Switching Protocols"],
  [200, 200, "OK"],
  [201, 201, "Created"],
  [300, 300, "Multiple Choices"],
  [400, 400, "Bad Request"],
  [421, 421, "Misdirected Request"],
  [499, 499, "499"],
  [500, 500, "Internal Server Error"],
  [600, 500, "600"],
  [700, 500, "700"],
  [800, 500, "800"],
  [900, 500, "900"],
  [1000, 500, "1000"],
  ["abc", 500, "abc"],
  ["Foobar", 500, "Foobar"],
])("GET /status/%s", (requestStatus, status, body) => {
  it("should echo the status", async () => {
    const response = await request(app.callback())
      .get(`/api/v1/dev/status/${requestStatus}`)
      .accept("application/json")
      .send();
    expect(response.status).toBe(status);
    expect(response.text).toBe(body);
  });
});
