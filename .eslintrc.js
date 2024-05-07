module.exports = {
  extends: '@liutsing/eslint-config',
  ignorePatterns: ['docs'],
  rules: {
    'multiline-ternary': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description', // 举例 @ts-expect-error: Unreachable code error
      },
    ],
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'brace-style': 'off',
    'operator-linebreak': 'off',
    indent: 'off',
  },
}
