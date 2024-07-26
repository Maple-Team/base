module.exports = {
  extends: '@liutsing/eslint-config',
  // extends: '@antfu/eslint-config',
  ignorePatterns: ['*.js', '*.json', '*.html', '*.gitignore', '*.conf', '*.yaml'],
  rules: {
    '@typescript-eslint/await-thenable': 'off',
    'brace-style': 'off',
    indent: 'off',
    'multiline-ternary': 'off',
    'operator-linebreak': 'off',
    'prettier/prettier': 'off',
  },
}
