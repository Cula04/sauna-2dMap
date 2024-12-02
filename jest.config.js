module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  rootDir: "./",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  coverageReporters: ["text", "html"],
  collectCoverageFrom: [
    "**/src/**/**/*.{ts,tsx,js,jsx}",
    "!**/.coverage/**",
    "!app.ts",
    "!index.ts",
    "!dist/**",
  ],
  coverageDirectory: "src/__tests__/.coverage",
  testEnvironment: "node",
};
