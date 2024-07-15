import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageReporters: ["text"],
};

export default config;
