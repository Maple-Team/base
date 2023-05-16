/**
 * @type {import('jest').Config}
 */
const config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '.(css|less|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
  },
  globals: {
    tsconfig: 'tsconfig.jest.json',
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
}
module.exports = config
