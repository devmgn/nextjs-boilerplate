const { defaults } = require('jest-config');
const nextJest = require('next/jest');

// @ts-ignore
const createJestConfig = nextJest({
  dir: './',
});

const jestConfig = {
  ...defaults,
  coverageReporters: ['html'],
  globalSetup: '<rootDir>/jest.globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  moduleNameMapper: {
    '^.+\\.(svg\\?inline)$': '<rootDir>/__mocks__/SvgMock.jsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = async () => {
  return {
    ...(await createJestConfig(jestConfig)()),
    transformIgnorePatterns: jestConfig.transformIgnorePatterns.filter(
      (pattern) => pattern !== '/node_modules/',
    ),
  };
};
