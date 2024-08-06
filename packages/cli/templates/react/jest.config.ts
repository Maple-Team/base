import type { Config } from 'jest'

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // runtime
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
}

export default config
