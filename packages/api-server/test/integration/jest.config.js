module.exports = {
  // -- Files--
  rootDir: "../../src",
  testMatch: ["**/*.int.test.{js,mjs,ts}"],
  setupFilesAfterEnv: ["../test/integration/jest.setup.js"],

  // -- Behavior --
  automock: false,
  preset: "ts-jest",
  testEnvironment: "node",

  // -- Coverage --
  collectCoverage: true,
  coverageProvider: "v8",
  coveragePathIgnorePatterns: [
    "/src/features/db/entities",
    "/src/features/kratos/entities",
  ],
};
