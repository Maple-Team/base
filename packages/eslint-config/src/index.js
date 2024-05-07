import path from 'node:path'
import { defineConfig } from 'eslint-define-config'
import { isPackageExists } from 'local-pkg'
import { baseRules } from './base'
import { reactRules } from './react'
import { vueRules } from './vue'
import { typescriptRules } from './typescript'

const TS = isPackageExists('typescript')

if (!TS) console.warn('[@liutsing/eslint-config] TypeScript is not installed, fallback to JS only.')

// TODO 1. 整理规则; 2. 规则范围问题

const baseSettings = {
  'import/resolver': {
    node: { extensions: ['.js', '.mjs'] },
  },
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
  extends: ['standard', 'prettier', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  plugins: ['prettier', 'unused-imports'],
  rules: {
    ...baseRules,
  },
  reportUnusedDisableDirectives: true,
  ignorePatterns: [
    '*.min.*',
    '*.d.ts',
    'CHANGELOG.md',
    '*.md',
    'dist',
    'LICENSE*',
    'output',
    'out',
    'coverage',
    'public',
    'temp',
    'package-lock.json',
    'package.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    // ignore for in lint-staged
    '*.css',
    '*.png',
    '*.ico',
    '*.toml',
    '*.patch',
    '*.txt',
    '*.crt',
    '*.key',
    'Dockerfile',
    '*.html',
    // force include
    '!.github',
    '!.vitepress',
    '!.vscode',
  ],
  settings: {
    ...baseSettings,
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      excludedFiles: ['**/*.md/*.*', '.eslintrc.js'],
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
        project: ['./tsconfig.json'],
        tsconfigRootDir: path.dirname(path.resolve(process.cwd(), 'tsconfig.json')),
      },
      settings: {
        'import/resolver': {
          node: { extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.d.ts'] },
        },
      },
      extends: [
        'standard',
        'standard-jsx',
        '@liutsing/eslint-config-standard-react',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
      rules: {
        ...baseRules,
        ...typescriptRules,
        ...reactRules,
        'no-throw-literal': 'off',
        '@typescript-eslint/no-throw-literal': 'error',
        'no-implied-eval': 'off',
        '@typescript-eslint/no-implied-eval': 'error',
        'dot-notation': 'off',
        '@typescript-eslint/dot-notation': ['error', { allowKeywords: true }],
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/await-thenable': 'error',
        '@typescript-eslint/no-for-in-array': 'error',
        '@typescript-eslint/no-unnecessary-type-assertion': 'error',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'require-await': 'off',
        '@typescript-eslint/require-await': 'error',
        '@typescript-eslint/restrict-plus-operands': 'error',
        '@typescript-eslint/restrict-template-expressions': 'error',
        '@typescript-eslint/unbound-method': 'error',
      },
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      extends: ['plugin:vue/vue3-essential', 'plugin:vue/vue3-recommended'],
      rules: {
        ...baseRules,
        ...typescriptRules,
        ...vueRules,
      },
    },
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      plugins: ['jest'],
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
