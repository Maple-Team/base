/**
 * react 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
export const reactRules = {
  'jsx-quotes': ['error', 'prefer-double'],
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-curly-newline': 'off',
  'react/jsx-indent': 'off',
  'react/jsx-handler-names': 'off',
  'react/prop-types': 'off',
  'react/display-name': 'off',
}
