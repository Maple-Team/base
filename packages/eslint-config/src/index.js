import { defineConfig } from 'eslint-define-config'
import path from 'path'

/**
 * 目的：Support lint Vue, React, ts, js files
 */
/**
 * 是否React项目
 */
let isReactExist = false
/**
 * 是否Vue项目
 */
let isVueExist = false

try {
  require('react')
  isReactExist = true
} catch (error) {}
try {
  require('vue')
  isVueExist = true
} catch (error) {}

// TODO 1. 整理规则; 2. 规则范围问题
/**
 * react 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
const reactRules = {
  'jsx-quotes': ['error', 'prefer-double'],
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react/jsx-curly-newline': 'off',
  'react/jsx-indent': 'off',
  'react/jsx-handler-names': 'off',
}

/**
 * vue 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
const vueRules = {
  'vue/script-setup-uses-vars': 'error',
  'vue/custom-event-name-casing': 'off',
  'vue/attributes-order': 'off',
  'vue/one-component-per-file': 'off',
  'vue/html-closing-bracket-newline': 'off',
  'vue/max-attributes-per-line': 'off',
  'vue/multiline-html-element-content-newline': 'off',
  'vue/singleline-html-element-content-newline': 'off',
  'vue/attribute-hyphenation': 'off',
  'vue/require-default-prop': 'off',
  'vue/html-self-closing': [
    'error',
    {
      html: {
        void: 'always',
        normal: 'never',
        component: 'always',
      },
      svg: 'always',
      math: 'always',
    },
  ],
  'vue/multi-word-component-names': [
    'error',
    {
      ignores: ['index'],
    },
  ],
}
/**
 * ts文件 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
const typescriptRules = {
  // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
  'default-case': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
  'no-dupe-class-members': 'off',
  // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
  'no-undef': 'off',
  'no-unused-vars': 'off',
  'no-array-constructor': 'off',
  'no-use-before-define': 'off',
  'standard/no-callback-literal': 'off',
  'no-useless-constructor': 'off',
  // Add TypeScript specific rules (and turn off ESLint equivalents)
  '@typescript-eslint/consistent-type-assertions': 'warn',
  '@typescript-eslint/no-array-constructor': 'warn',
  '@typescript-eslint/no-namespace': 'error',
  '@typescript-eslint/no-use-before-define': [
    'error',
    {
      functions: false,
      classes: false,
      variables: false,
      typedefs: false,
    },
  ],
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      vars: 'all',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    },
  ],
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/member-delimiter-style': 'off',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/no-useless-constructor': 'warn',
  '@typescript-eslint/ban-ts-ignore': 'off',
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  'vue/custom-event-name-casing': 'off',
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
}
/**
 * 基础js 自定义规则配置
 * @type {import('eslint').Linter.RulesRecord}
 */
const baseRules = {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
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
  'no-var': 'error',
}

/**
 * 导出的eslint配置文件
 */
const eslintConfig = defineConfig({
  root: true,
  /**
   * 可用的环境
   */
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  /**
   * 继承来源
   */
  extends: [
    'standard',
    isReactExist && 'standard-jsx',
    isReactExist && '@liutsing/eslint-config-standard-react',
    'prettier',
    'plugin:prettier/recommended',
  ].filter(Boolean),
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: [isReactExist && 'react', isReactExist && 'react-hooks', 'prettier'].filter(Boolean),
  rules: {
    ...baseRules,
    ...(isReactExist ? reactRules : {}),
  },
  settings: isReactExist
    ? {
        react: {
          version: 'detect',
        },
      }
    : {},

  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
        project: ['tsconfig.json'],
        tsconfigRootDir: path.dirname(path.resolve(process.cwd(), 'tsconfig.json')),
      },
      extends: [
        'standard',
        isReactExist && 'standard-jsx',
        isReactExist && '@liutsing/eslint-config-standard-react',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
      ].filter(Boolean),
      plugins: [isReactExist && 'react', isReactExist && 'react-hooks', 'prettier', '@typescript-eslint'].filter(
        Boolean
      ),
      rules: {
        ...baseRules,
        ...typescriptRules,
        ...(isReactExist
          ? {
              'react/prop-types': 'off',
              'react-hooks/rules-of-hooks': 'error',
              'react-hooks/exhaustive-deps': 'warn',
              'react/jsx-curly-newline': 'off',
              'react/jsx-indent': 'off',
              'react/jsx-handler-names': 'off',
            }
          : {}),
        ...(isVueExist
          ? {
              // TODO
            }
          : {}),
      },
    },
    {
      files: ['**/*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: {
          // NOTE customer parser to parse <script> tags
          ts: '@typescript-eslint/parser',
          js: '@babel/eslint-parser',
        },
        ecmaVersion: 2020,
        sourceType: 'module',
        jsxPragma: 'preserve',
        ecmaFeatures: {
          jsx: true,
        },
        vueFeatures: {
          // NOTE specify how to parse related to Vue features
          filter: false, // specify whether to parse the Vue2 filter | 过滤符号
          interpolationAsNonHTML: true, // work for {{ a < b }}
          styleCSSVariableInjection: true, // to parse expressions in `v-bind` CSS functions inside `<style>` tags
        },
      },
      extends: ['plugin:vue/vue3-essential', 'plugin:vue/vue3-recommended'],
      rules: {
        ...baseRules,
        ...typescriptRules,
        ...vueRules,
        'space-before-function-paren': 'off',
      },
    },
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
})

export default eslintConfig
