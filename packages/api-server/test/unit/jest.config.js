export default {
  // -- Files--
  rootDir: "../../src",
  testMatch: ["**/*.test.{js,mjs,ts}"],
  testPathIgnorePatterns: ["int.test.ts"],

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
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // -- Coverage --
  collectCoverage: true,
  coverageProvider: "v8",
};
