module.exports = {
  projects: ["<rootDir>/test/*"],
  collectCoverage: true,
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: "node",
};
