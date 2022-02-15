module.exports = {
  projects: ["<rootDir>/test/*"],
  collectCoverage: true,
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
  testEnvironment: "node",
};
