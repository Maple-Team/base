module.exports = {
  extends: '@liutsing/eslint-config',
  // extends: '@antfu/eslint-config',
  ignorePatterns: ['**/public/*.js', '*.json'],
  rules: {
    '@typescript-eslint/await-thenable': 'off',
  },
}
