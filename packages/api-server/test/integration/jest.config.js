module.exports = {
  // -- Files--
  rootDir: "../../",
  testMatch: ["**/*.int.test.{js,mjs,ts}"],

  // -- Behavior --
  automock: false,
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
