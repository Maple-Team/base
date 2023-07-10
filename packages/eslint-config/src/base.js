/**
 * 基础js 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
export const baseRules = {
  'quote-props': ['error', 'as-needed'],
  quotes: 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-console': process.env.NODE_ENV === 'production' ? ['error', { allow: ['debug', 'warn', 'error'] }] : 'off',

  'prettier/prettier': 'error',
  'standard/no-callback-literal': 'off',
  'no-unused-vars': [
    'error',
    {
      vars: 'all',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  'no-undef': 'error',

  // copy from @antfu/eslint-config
  'no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
  'eslint-comments/disable-enable-pair': 'off',
  'import/no-named-as-default-member': 'off',
  'import/no-named-as-default': 'off',
  'import/namespace': 'off',

  'sort-imports': [
    'error',
    {
      ignoreCase: false,
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      allowSeparatedGroups: false,
    },
  ],
  // best-practice
  'array-callback-return': 'error',
  'block-scoped-var': 'error',
  'consistent-return': 'off',
  complexity: ['off', 11],
  eqeqeq: ['error', 'smart'],
  'no-alert': 'warn',
  'no-case-declarations': 'error',
  'no-multi-spaces': 'error',
  'no-multi-str': 'error',
  'no-with': 'error',
  'no-void': 'error',
  'no-useless-escape': 'off',
  'vars-on-top': 'error',
  'require-await': 'off',
  'no-return-assign': 'off',
  'max-statements-per-line': ['error', { max: 1 }],

  // node
  // 'n/prefer-global/process': ['error', 'never'], // Not sure if we need it as we are using `process.env.NODE_ENV` a lot in front-end.
  'n/prefer-global/buffer': ['error', 'never'],
  'n/no-callback-literal': 'off',

  // import
  'import/order': 'error',
  'import/first': 'error',
  'import/no-mutable-exports': 'error',
  'import/no-unresolved': 'off',
  'import/no-absolute-path': 'off',
  'import/newline-after-import': ['error', { count: 1 }],

  // Common
  semi: ['error', 'never'],
  curly: ['error', 'multi-or-nest', 'consistent'],

  'unused-imports/no-unused-imports': 'error',
  'unused-imports/no-unused-vars': [
    'warn',
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
  ],

  'no-param-reassign': 'off',
  'array-bracket-spacing': ['error', 'never'],
  'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
  'block-spacing': ['error', 'always'],
  camelcase: 'off',
  'comma-spacing': ['error', { before: false, after: true }],
  'comma-style': ['error', 'last'],
  'comma-dangle': ['error', 'only-multiline'],
  'no-constant-condition': 'warn',
  'no-cond-assign': ['error', 'always'],
  'func-call-spacing': ['off', 'never'],
  'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  indent: ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],
  'no-restricted-syntax': ['error', 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
  'object-curly-spacing': ['error', 'always'],
  'no-return-await': 'off',
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    },
  ],

  // es6
  'no-var': 'error',
  'prefer-const': [
    'error',
    {
      destructuring: 'all',
      ignoreReadBeforeAssign: true,
    },
  ],
  'prefer-arrow-callback': [
    'error',
    {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    },
  ],
  'object-shorthand': [
    'error',
    'always',
    {
      ignoreConstructors: false,
      avoidQuotes: true,
    },
  ],
  'prefer-exponentiation-operator': 'error',
  'prefer-rest-params': 'error',
  'prefer-spread': 'error',
  'prefer-template': 'error',
  'template-curly-spacing': 'error',
  'arrow-parens': ['error', 'always'],
  'generator-star-spacing': 'off',
  'spaced-comment': [
    'error',
    'always',
    {
      line: {
        markers: ['/'],
        exceptions: ['/', '#'],
      },
      block: {
        markers: ['!'],
        exceptions: ['*'],
        balanced: true,
      },
    },
  ],
  'multiline-ternary': 'off',
  'operator-linebreak': 'off',
}
