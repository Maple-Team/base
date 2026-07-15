module.exports = {
  clearMocks: true,
  collectCoverage: false,
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
  rootDir: '.',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}
