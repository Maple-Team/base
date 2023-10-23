module.exports = {
  extends: '@liutsing/eslint-config',
  // extends: '@antfu/eslint-config',
  ignorePatterns: ['**/public/*.js', '*.json', '*.html', '*.gitignore'],
  rules: {
    '@typescript-eslint/await-thenable': 'off',
    'brace-style': 'off',
    indent: 'off',
    'multiline-ternary': 'off',
    'operator-linebreak': 'off',
  },
}
