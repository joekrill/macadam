import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { EntityManager } from "@mikro-orm/core";
import { FrontendApi } from "@ory/kratos-client";
import request from "supertest";
import type { createApp } from "../../../app.js";
import { Thing } from "../../../features/db/entities/Thing.js";
import { createAppTestOptions } from "../../../test/createAppTestOptions.js";

const FrontendApiMock = jest.fn<() => FrontendApi>();
jest.unstable_mockModule("@ory/kratos-client", () => ({
  Configuration: jest.fn(),
  FrontendApi: FrontendApiMock,
  IdentityApi: jest.fn(),
}));
jest.setTimeout(30000);

const initApp = async ({ identityId }: { identityId?: string } = {}) => {
  // @ts-ignore
  FrontendApiMock.mockImplementation(() => {
    return {
      toSession: () =>
        identityId
          ? Promise.resolve({
              data: {
                identity: {
                  id: "123",
                  verifiable_addresses: [
                    {
                      id: "1",
                      status: "completed",
                      value: "someone@example.com",
                      verified: true,
                      verified_at: "2013-10-07T08:23:19Z",
                      via: "email",
                    },
                  ],
                },
              },
            })
          : Promise.reject({ status: 401 }),
    };
  });

  // Dynamically load the app code so that the mocks get applies
  const { createApp } = await import("../../../app.js");

  const app = await createApp(createAppTestOptions);
  await app.context.db.orm.getMigrator().up();
  return app;
};

describe("authenticated", () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  let em: EntityManager;
  let cookies: string[];

  beforeEach(async () => {
    app = await initApp({ identityId: "123" });

    // Requests must include a session cookie otherwise the session lookup
    // will be skipped.
    cookies = [`${createAppTestOptions.kratos.sessionCookieName}=XX`];
    em = app.context.db.orm.em.fork();

    // Remove any existing data
    await em.nativeDelete("Thing", {}, { filters: false });
  });

  afterEach(async () => {
    await em.flush();
    em.clear();
    await app.context.shutdown();
  });

  describe("GET /things", () => {
    describe("when there are no things", () => {
      it("returns an empty array things", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
          .set("Cookie", cookies)
          .send();
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          data: [],
        });
      });
    });

    describe("when there are things", () => {
      beforeEach(async () => {
        em.persist([
          new Thing("123", "Item 1"),
          new Thing("123", "Item 2"),
          new Thing("123", "Item 3"),
          new Thing("123", "Item 4"),
        ]).flush();
      });

      it("returns all things", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
          .set("Cookie", cookies)
          .send();
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          data: expect.arrayContaining([
            expect.objectContaining({ name: "Item 1" }),
            expect.objectContaining({ name: "Item 2" }),
            expect.objectContaining({ name: "Item 3" }),
            expect.objectContaining({ name: "Item 4" }),
          ]),
        });
      });
    });

    describe("paging", () => {
      beforeEach(async () => {
        em.persist(
          Array.from({ length: 35 }, (_, i) => new Thing("123", `Item ${i}`)),
        ).flush();
      });

      describe.each([
        [
          "page: 4",
          { "page[number]": 4 },
          { count: 5, limit: 10, offset: 30, page: 4, totalPages: 4 },
        ],
        [
          "no params",
          {},
          { count: 10, limit: 10, offset: 0, page: 1, totalPages: 4 },
        ],
        [
          "limit: 4",
          { "page[limit]": 4, "page[number]": 2 },
          { count: 4, limit: 4, offset: 4, page: 2, totalPages: 9 },
        ],
      ])("%s", (_, query, pagination) => {
        let response: request.Response;

        beforeEach(async () => {
          response = await request(app.callback())
            .get("/api/v1/things")
            .set("Cookie", cookies)
            .query(query)
            .send();
        });

        it("is successful", () => {
          expect(response.status).toBe(200);
          expect(response.body.data!).toHaveLength(pagination.count);
          expect(response.body).toMatchObject({
            pagination: expect.objectContaining({
              ...pagination,
              totalCount: 35,
            }),
          });
        });
      });

      it("returns 10 items by default", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
          .set("Cookie", [
            `${createAppTestOptions.kratos.sessionCookieName}=XX`,
          ])
          .send();
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          pagination: expect.objectContaining({
            count: 10,
            limit: 10,
            offset: 0,
            page: 1,
            totalCount: 35,
            totalPages: 4,
          }),
        });
      });

      it("returns pagination metadata", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
          .set("Cookie", cookies)
          .send();
        expect(response.body).toMatchObject({
          pagination: expect.objectContaining({
            count: 10,
            limit: 10,
            offset: 0,
            page: 1,
            totalCount: 35,
            totalPages: 4,
          }),
        });
      });
    });
  });

  describe("POST /things", () => {
    describe("with valid body", () => {
      it("returns a 201", async () => {
        const response = await request(app.callback())
          .post("/api/v1/things")
          .set("Cookie", cookies)
          .send({
            name: "hello!",
            description: "a simple greeting",
          });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          data: expect.objectContaining({
            name: "hello!",
            description: "a simple greeting",
            createdBy: "123",
            updatedBy: "123",
          }),
        });
      });
    });

    describe("with invalid body", () => {
      it("returns a 400", async () => {
        const response = await request(app.callback())
          .post("/api/v1/things")
          .set("Cookie", cookies)
          .send({
            description: "I'm nameless!",
          });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
          error: expect.objectContaining({
            name: "ValidationError",
          }),
        });
      });
    });
  });

  describe("DELETE /things/:id", () => {
    let ownedThing: Thing;
    let unownedThing: Thing;

    beforeEach(async () => {
      ownedThing = new Thing("123", "Item 1");
      ownedThing.isPublic = true;
      unownedThing = new Thing("567", "Item 2");
      unownedThing.isPublic = true;
      em.persist([ownedThing, unownedThing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .delete(`/api/v1/things/2342342343232`)
          .set("Cookie", cookies)
          .send();
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .delete(`/api/v1/things/${ownedThing.id}`)
          .set("Cookie", cookies)
          .send();
      });

      it("returns a 204", () => {
        expect(response.status).toBe(204);
      });

      it("deletes the Thing", async () => {
        expect.assertions(1);
        const count = await em.count(
          "Thing",
          {
            id: ownedThing.id,
          },
          { filters: { ability: false } },
        );
        expect(count).toBe(0);
      });
    });

    describe("when not owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .delete(`/api/v1/things/${unownedThing.id}`)
          .set("Cookie", cookies)
          .send();
      });

      it(`returns a 403`, () => {
        expect(response.status).toBe(403);
      });
    });
  });

  describe("PATCH /things/:id", () => {
    let ownedThing: Thing;
    let unownedThing: Thing;

    beforeEach(async () => {
      ownedThing = new Thing("123", "Item 1");
      ownedThing.isPublic = true;
      unownedThing = new Thing("567", "Item 2");
      unownedThing.isPublic = true;
      em.persist([ownedThing, unownedThing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .patch(`/api/v1/things/XXXXXX`)
          .set("Cookie", cookies)
          .send({ name: "new name" });
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .patch(`/api/v1/things/${ownedThing.id}`)
          .set("Cookie", cookies)
          .send({
            description: "a description!",
          });
      });

      it("returns a 200 with the updated entity", () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              name: "Item 1",
              description: "a description!",
            }),
          }),
        );
      });

      it("updates the chagned fields", async () => {
        expect.assertions(1);
        await em.clear();
        const thing = await em.findOne(
          Thing,
          {
            id: ownedThing.id,
          },
          { filters: false },
        );
        expect(thing?.description).toBe("a description!");
      });

      it("does not change other fields", async () => {
        expect.assertions(1);
        const thing = await em.findOne(
          Thing,
          {
            id: ownedThing.id,
          },
          { filters: false },
        );
        expect(thing?.name).toBe("Item 1");
      });
    });

    describe("when not owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .patch(`/api/v1/things/${unownedThing.id}`)
          .set("Cookie", cookies)
          .send({ description: "hi there" });
      });

      it(`returns a 403`, () => {
        expect(response.status).toBe(403);
      });
    });
  });

  describe("PUT /things/:id", () => {
    let thing: Thing;

    beforeEach(async () => {
      thing = new Thing("123", "Item 2", "A description");
      em.persist([thing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .put(`/api/v1/things/XXXXXX`)
          .set("Cookie", cookies)
          .send({ name: "new name" });
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .put(`/api/v1/things/${thing.id}`)
          .set("Cookie", cookies)
          .send({
            name: "A new name!",
          });
      });

      it("returns a 200 with the updated entity", () => {
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              name: "A new name!",
            }),
          }),
        );
      });

      it("Replaces all fields", async () => {
        expect.assertions(2);
        await em.clear();
        const updated = await em.findOne(
          Thing,
          {
            id: thing.id,
          },
          { filters: false },
        );
        expect(updated?.description).toBeNull();
        expect(updated?.name).toBe("A new name!");
      });
    });
  });
});

describe("unauthenticated", () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeEach(async () => {
    app = await initApp();
  });

  afterEach(async () => {
    await app.context.shutdown();
  });

  it("returns a 401", async () => {
    const response = await request(app.callback()).post("/api/v1/things").send({
      name: "hello!",
      description: "a simple greeting",
    });
    expect(response.status).toBe(401);
  });
});
