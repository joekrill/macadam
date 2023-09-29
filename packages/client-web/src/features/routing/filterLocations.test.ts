import { To } from "history";
import { describe, expect, test } from "vitest";
import { filterLocations } from "./filterLocations";

describe("when `forbid` is empty", () => {
  const forbid: string[] = [];

  describe("and `candidates` is empty", () => {
    const candidates: To[] = [];

    test("returns undefined", () => {
      expect(filterLocations(candidates, forbid)).toBeUndefined();
    });
  });

  describe("and `candidates` is not empty", () => {
    const candidates: To[] = ["foo", "bar"];

    test("returns the first candidate", () => {
      expect(filterLocations(candidates, forbid)).toBe(candidates[0]);
    });
  });

  describe("and `candidates` contains undefined values", () => {
    const candidates: (To | undefined)[] = [undefined, "foo", "bar"];

    test("returns the first defined candidate", () => {
      expect(filterLocations(candidates, forbid)).toBe(candidates[1]);
    });
  });
});

describe("when `candidates` is empty", () => {
  const candidates: To[] = [];

  test("returns undefined", () => {
    expect(filterLocations(candidates, [])).toBeUndefined();
  });
});

describe.each([
  ["string candidates, forbid empty", [["/foo", "/bar", "/baz"], []], "/foo"],
  [
    "string and Location candidates, forbid empty",
    [[{ pathname: "/foo" }, "/bar", "/baz"], []],
    { pathname: "/foo" },
  ],
  [
    "Location candidates, forbid empty",
    [[{ pathname: "/foo" }, { pathname: "/bar" }], []],
    { pathname: "/foo" },
  ],
  [
    "string candidates, forbid first",
    [["/foo", "/bar", "/baz"], ["/foo/*"]],
    "/bar",
  ],
  [
    "string candidates, forbid first and second",
    [
      ["/foo", "/bar", "/baz"],
      ["/bar/*", "/foo/*"],
    ],
    "/baz",
  ],
  [
    "string candidates, forbid all exact",
    [
      ["/foo", "/bar", "/baz"],
      ["/bar/*", "/baz/*", "/foo/*"],
    ],
    undefined,
  ],
  [
    "string candidates, forbid all wildcards",
    [
      ["/foo", "/bar", "/baz"],
      ["/bar", "/baz", "/foo"],
    ],
    undefined,
  ],
  [
    "non-exact string candidates",
    [["/foo/123", "/foo", "/foo/x/123"], ["/foo/*"]],
    undefined,
  ],
  [
    "non-exact Location candidates",
    [
      [{ pathname: "/foo/123" }, "/foo", { pathname: "/foo/x/123" }],
      ["/foo/*"],
    ],
    undefined,
  ],
] as [
  string,
  Parameters<typeof filterLocations>,
  ReturnType<typeof filterLocations>,
][])("%s", (_, params, expected) => {
  test(`returns ${JSON.stringify(expected)}`, () => {
    expect(filterLocations(...params)).toEqual(expected);
  });
});
