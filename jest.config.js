// eslint-disable-next-line import/no-extraneous-dependencies
const { defaults } = require('jest-config');
const nextJest = require('next/jest');

console.log(defaults);

// @ts-ignore
const createJestConfig = nextJest({
  dir: './',
});

module.exports = createJestConfig({
  ...defaults,
  coverageReporters: ['html', 'text'],
  globalSetup: '<rootDir>/jest.globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.tsx'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/__mocks__/SvgMock.jsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  snapshotSerializers: [
    '@emotion/jest/serializer' /* if needed other snapshotSerializers should go here */,
  ],
  verbose: true,
});
