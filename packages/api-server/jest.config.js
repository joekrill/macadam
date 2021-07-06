module.exports = {
  projects: ["<rootDir>/test/*"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/@types/*",
    "!src/**/*.test.{js,ts}",
  ],
  coverageProvider: "v8",
};
