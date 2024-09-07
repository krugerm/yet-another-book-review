module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['expect-puppeteer'],
};