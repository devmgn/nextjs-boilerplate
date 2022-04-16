const { defaults } = require('jest-config');
const nextJest = require('next/jest');

// @ts-ignore
const createJestConfig = nextJest({
  dir: './',
});

module.exports = createJestConfig({
  ...defaults,
  coverageReporters: ['html', 'text'],
  globalSetup: '<rootDir>/jest.globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  testEnvironment: 'jest-environment-jsdom',
});
