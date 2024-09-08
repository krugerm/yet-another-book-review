// jest.config.mjs
export default {
    preset: 'jest-puppeteer',
    testEnvironment: 'jest-environment-puppeteer',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'babel-jest'
    },
    testTimeout: 30000,
    maxConcurrency: 3,
    transformIgnorePatterns: [
      "/node_modules/(?!chai/)"  // Transform "chai" module
    ]
  };
  