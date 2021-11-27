module.exports = {
  // -- Files--
  rootDir: "../../src",
  testMatch: ["**/*.int.test.{js,mjs,ts}"],

  // -- Behavior --
  automock: false,
  preset: "ts-jest",
  testEnvironment: "node",

  // -- Coverage --
  collectCoverage: true,
  coverageProvider: "v8",
};
