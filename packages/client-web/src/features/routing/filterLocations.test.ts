import { LocationDescriptor } from "history";
import { filterLocations } from "./filterLocations";

describe("when `forbid` is empty", () => {
  const forbid: string[] = [];

  describe("and `candidates` is empty", () => {
    const candidates: LocationDescriptor[] = [];

    describe("and `fallback` is provided", () => {
      const fallback: LocationDescriptor = "/blah";
      test("returns the `fallback` value", () => {
        expect(filterLocations(candidates, { forbid, fallback })).toBe(
          fallback
        );
      });
    });

    describe("and `fallback` is not provided", () => {
      test("returns undefined", () => {
        expect(filterLocations(candidates, { forbid })).toBeUndefined();
      });
    });
  });

  describe("and `candidates` is not empty", () => {
    const candidates: LocationDescriptor[] = ["foo", "bar"];

    test("returns the first candidate", () => {
      expect(filterLocations(candidates, { forbid })).toBe(candidates[0]);
    });
  });
});

describe("when `candidates` is empty", () => {
  const candidates: LocationDescriptor[] = [];

  describe("and `fallback` is provided", () => {
    const fallback = "/fallback";

    test("returns undefined", () => {
      expect(filterLocations(candidates, { forbid: [], fallback })).toBe(
        fallback
      );
    });
  });

  describe("and `fallback` is not provided", () => {
    test("returns undefined", () => {
      expect(filterLocations(candidates, { forbid: [] })).toBeUndefined();
    });
  });
});

describe.each([
  [
    "string candidates, forbid empty",
    [["/foo", "/bar", "/baz"], { forbid: [] }],
    "/foo",
  ],
  [
    "string and Location candidates, forbid empty",
    [[{ pathname: "/foo" }, "/bar", "/baz"], { forbid: [] }],
    { pathname: "/foo" },
  ],
  [
    "Location candidates, forbid empty",
    [[{ pathname: "/foo" }, { pathname: "/bar" }], { forbid: [] }],
    { pathname: "/foo" },
  ],
  [
    "string candidates, forbid first",
    [["/foo", "/bar", "/baz"], { forbid: ["/foo"] }],
    "/bar",
  ],
  [
    "string candidates, forbid first and second",
    [["/foo", "/bar", "/baz"], { forbid: ["/bar", "/foo"] }],
    "/baz",
  ],
  [
    "string candidates, forbid all",
    [["/foo", "/bar", "/baz"], { forbid: ["/bar", "/baz", "/foo"] }],
    undefined,
  ],
  [
    "string candidates, forbid all with fallback",
    [
      ["/foo", "/bar", "/baz"],
      { forbid: ["/bar", "/baz", "/foo"], fallback: "/hello" },
    ],
    "/hello",
  ],
  [
    "non-exact string candidates",
    [["/foo/123", "/foo", "/foo/x/123"], { forbid: ["/foo"] }],
    undefined,
  ],
  [
    "non-exact Location candidates",
    [
      [{ pathname: "/foo/123" }, "/foo", { pathname: "/foo/x/123" }],
      { forbid: ["/foo"] },
    ],
    undefined,
  ],
] as [string, Parameters<typeof filterLocations>, ReturnType<typeof filterLocations>][])(
  "%s",
  (_, params, expected) => {
    test(`returns ${JSON.stringify(expected)}`, () => {
      expect(filterLocations(...params)).toEqual(expected);
    });
  }
);
