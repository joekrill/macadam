export default {
  // -- Files--
  rootDir: "../../src",
  testMatch: ["**/*.int.test.{js,mjs,ts}"],
  setupFilesAfterEnv: ["../test/integration/jest.setup.js"],

  // -- Behavior --
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.m?ts$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // -- Coverage --
  collectCoverage: true,
  coverageProvider: "v8",
  coveragePathIgnorePatterns: [
    "/src/features/db/entities",
    "/src/features/kratos/entities",
  ],
};
