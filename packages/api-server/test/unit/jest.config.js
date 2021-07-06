module.exports = {
  // -- Files--
  rootDir: "../../",
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
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/@types/*",
    "!src/**/*.test.{js,ts}",
  ],
  coverageProvider: "v8",
};
