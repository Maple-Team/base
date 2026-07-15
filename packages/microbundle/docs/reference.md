## `rollup.config.js`
> 适配 React Hooks 库
```ts
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts', // 库的入口，通常导出所有的 hooks
  output: [
    // 1. ESM 格式：供现代前端项目（Vite/Webpack5）使用，支持 Tree-shaking
    {
      file: pkg.module || 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    // 2. CJS 格式：供旧版 Node.js 环境或旧版 SSR 框架兼容使用
    {
      file: pkg.main || 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto',
    }
  ],
  // 核心安全机制：自动排除 React 和 package.json 中的所有依赖
  external: [
    'react', 
    'react-dom',
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: true,         // 自动为 Hooks 生成类型声明
        declarationDir: './dist/types',
      },
      exclude: ['**/__tests__/**', '*.test.ts', '*.test.tsx']
    }),
    terser({
      ecma: 2020,
      compress: {
        passes: 2,
        drop_console: true // 移除调试用的 console.log
      }
    })
  ]
};

```

> `@liutsing/microbundle` 目前还没有暴露这种 Rollup 配置入口。它只会在
> `.min.*` 产物上调用空配置的 `terser()`，所以 `drop_console: true` 这类选项
> 现在不会默认启用，除非后续增加配置 API。
