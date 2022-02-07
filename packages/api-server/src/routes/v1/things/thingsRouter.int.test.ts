import { V0alpha2Api } from "@ory/kratos-client";
import pino from "pino";
import request from "supertest";
import { createApp } from "../../../app";
import { Thing } from "../../../features/db/entities/Thing";

let app: Awaited<ReturnType<typeof createApp>>;

jest.mock("@ory/kratos-client");
jest.unmock("@mikro-orm/migrations");

const V0alpha2ApiMock = V0alpha2Api as jest.Mock<V0alpha2Api>;

const initApp = async ({ identityId }: { identityId?: string } = {}) => {
  // @ts-ignore
  V0alpha2ApiMock.mockImplementation(() => {
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

  app = await createApp({
    environment: "test",
    dbUrl: "sqlite::memory:",
    logger: pino({ enabled: false }),
    kratosPublicUrl: "",
    kratosDbUrl: "sqlite::memory:",
  });
  await app.context.db.orm.getMigrator().up();

  // Remove any test data
  await app.context.db.orm.em.nativeDelete("Thing", {}, { filters: false });
};

describe("authenticated", () => {
  beforeEach(async () => {
    await initApp({ identityId: "123" });
  });

  afterEach(async () => {
    app.context.db.orm.em.flush();
    await app.context.shutdown();
  });

  describe("GET /things", () => {
    describe("when there are no things", () => {
      it("returns an empty array things", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
          .send();
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          data: [],
        });
      });
    });

    describe("when there are things", () => {
      beforeEach(async () => {
        app.context.db.orm.em
          .persist([
            new Thing("123", "Item 1"),
            new Thing("123", "Item 2"),
            new Thing("123", "Item 3"),
            new Thing("123", "Item 4"),
          ])
          .flush();
      });

      it("returns all things", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
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
        app.context.db.orm.em
          .persist(
            Array.from({ length: 35 }, (_, i) => new Thing("123", `Item ${i}`))
          )
          .flush();
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

      it("returns pagination metadat", async () => {
        const response = await request(app.callback())
          .get("/api/v1/things")
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
      it("returns a 201", async () => {
        const response = await request(app.callback())
          .post("/api/v1/things")
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
      app.context.db.orm.em.persist([ownedThing, unownedThing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .delete(`/api/v1/things/2342342343232`)
          .send();
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .delete(`/api/v1/things/${ownedThing.id}`)
          .send();
      });

      it("returns a 204", () => {
        expect(response.status).toBe(204);
      });

      it("deletes the Thing", async () => {
        expect.assertions(1);
        const count = await app.context.db.orm.em.count(
          "Thing",
          {
            id: ownedThing.id,
          },
          { filters: { ability: false } }
        );
        expect(count).toBe(0);
      });
    });

    describe("when not owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .delete(`/api/v1/things/${unownedThing.id}`)
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
      app.context.db.orm.em.persist([ownedThing, unownedThing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .patch(`/api/v1/things/XXXXXX`)
          .send({ name: "new name" });
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .patch(`/api/v1/things/${ownedThing.id}`)
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
          })
        );
      });

      it("updates the chagned fields", async () => {
        expect.assertions(1);
        await app.context.db.orm.em.clear();
        const thing = await app.context.db.orm.em.findOne(
          Thing,
          {
            id: ownedThing.id,
          },
          { filters: false }
        );
        expect(thing?.description).toBe("a description!");
      });

      it("does not change other fields", async () => {
        expect.assertions(1);
        const thing = await app.context.db.orm.em.findOne(
          Thing,
          {
            id: ownedThing.id,
          },
          { filters: false }
        );
        expect(thing?.name).toBe("Item 1");
      });
    });

    describe("when not owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .patch(`/api/v1/things/${unownedThing.id}`)
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
      app.context.db.orm.em.persist([thing]).flush();
    });

    describe("when it doesn't exist", () => {
      it("returns a 404", async () => {
        const response = await request(app.callback())
          .put(`/api/v1/things/XXXXXX`)
          .send({ name: "new name" });
        expect(response.status).toBe(404);
      });
    });

    describe("when owned by the current user", () => {
      let response: request.Response;

      beforeEach(async () => {
        response = await request(app.callback())
          .put(`/api/v1/things/${thing.id}`)
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
          })
        );
      });

      it("Replaces all fields", async () => {
        expect.assertions(2);
        await app.context.db.orm.em.clear();
        const updated = await app.context.db.orm.em.findOne(
          Thing,
          {
            id: thing.id,
          },
          { filters: false }
        );
        expect(updated?.description).toBeNull();
        expect(updated?.name).toBe("A new name!");
      });
    });
  });
});

describe("unauthenticated", () => {
  beforeEach(async () => {
    await initApp();
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
