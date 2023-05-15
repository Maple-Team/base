module.exports = {
  extends: '@liutsing/eslint-config',
  rules: {
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description', // 举例 @ts-expect-error: Unreachable code error
      },
    ],
  },
}
