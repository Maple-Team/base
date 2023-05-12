/**
 * @type {import('jest').Config}
 */
const config = {
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
}
module.exports = config
