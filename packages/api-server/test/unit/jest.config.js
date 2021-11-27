module.exports = {
  // -- Files--
  rootDir: "../../src",
  testMatch: ["**/*.test.{js,mjs,ts}"],
  testPathIgnorePatterns: ["int.test.ts"],

  // -- Behavior --
  automock: true,
  unmockedModulePathPatterns: [
    "@shopify/jest-koa-mocks",
    // the debug module seems to be causing problems with `automock`
    "debug",
  ],
  preset: "ts-jest",
  testEnvironment: "node",

  // -- Coverage --
  collectCoverage: true,
  coverageProvider: "v8",
};
