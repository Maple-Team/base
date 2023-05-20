module.exports = {
  extends: '@liutsing/eslint-config',
  rules: {
    'multiline-ternary': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
  },
  ignorePatterns: ['*.json'],
}
