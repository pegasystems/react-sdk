// eslint-disable-next-line strict
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests/unit/', '<rootDir>/tests'],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  coverageDirectory: 'tests/coverage'
};
