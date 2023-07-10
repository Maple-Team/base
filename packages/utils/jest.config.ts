/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // runtime
  },
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/'],

  transform: {
    '\\.[jt]sx?$': 'babel-jest', // NOTE use babel-jest
    // '\\.[jt]sx?$': 'ts-jest', // NOTE use ts-jest
  },
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
}

export default config
