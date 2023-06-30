/**
 * ts文件 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
export const typescriptRules = {
  // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
  'default-case': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-array-constructor': 'off',
  'standard/no-callback-literal': 'off',
  // Add TypeScript specific rules (and turn off ESLint equivalents)
  '@typescript-eslint/consistent-type-assertions': 'warn',
  '@typescript-eslint/no-array-constructor': 'warn',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-useless-constructor': 'warn',
  '@typescript-eslint/no-var-requires': 'off',

  // copy from @antfu/eslint-config
  '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
  '@typescript-eslint/member-delimiter-style': ['error', { multiline: { delimiter: 'none' } }],
  '@typescript-eslint/type-annotation-spacing': ['error', {}],
  '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', disallowTypeAnnotations: false }],
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/prefer-ts-expect-error': 'error',

  // Override JS
  'no-useless-constructor': 'off',
  indent: 'off',
  'no-redeclare': 'off',
  '@typescript-eslint/no-redeclare': 'error',
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
  'brace-style': 'off',
  'comma-dangle': 'off',
  '@typescript-eslint/comma-dangle': ['error', 'only-multiline'],
  'object-curly-spacing': 'off',
  '@typescript-eslint/object-curly-spacing': ['error', 'always'],
  semi: 'off',
  '@typescript-eslint/semi': ['error', 'never'],
  quotes: 'off',
  '@typescript-eslint/quotes': ['error', 'single'],
  'space-before-blocks': 'off',
  '@typescript-eslint/space-before-blocks': ['error', 'always'],
  'space-before-function-paren': 'off',
  '@typescript-eslint/space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    },
  ],
  'space-infix-ops': 'off',
  '@typescript-eslint/space-infix-ops': 'error',
  'keyword-spacing': 'off',
  '@typescript-eslint/keyword-spacing': ['error', { before: true, after: true }],
  'comma-spacing': 'off',
  '@typescript-eslint/comma-spacing': ['error', { before: false, after: true }],
  'no-extra-parens': 'off',
  '@typescript-eslint/no-extra-parens': ['error', 'functions'],
  'no-dupe-class-members': 'off',
  '@typescript-eslint/no-dupe-class-members': 'error',
  'no-loss-of-precision': 'off',
  '@typescript-eslint/no-loss-of-precision': 'error',
  'lines-between-class-members': 'off',
  '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

  '@typescript-eslint/consistent-indexed-object-style': 'off',
  '@typescript-eslint/naming-convention': 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-member-accessibility': 'off',
  '@typescript-eslint/parameter-properties': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/ban-ts-ignore': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-namespace': 'off',
  '@typescript-eslint/triple-slash-reference': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/brace-style': 'off',
  '@typescript-eslint/require-await': 'off',
  '@typescript-eslint/indent': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off',
}
