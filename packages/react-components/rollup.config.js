import path from 'node:path'
import fs from 'node:fs'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import alias from '@rollup/plugin-alias'
import extractCss from '@liutsing/rollup-plugin-extract-style'
// import css from 'rollup-plugin-css-only';

const projectRootDir = path.resolve(__dirname)
const packageJson = require('./package.json')
const outputDir = 'dist/css'
const customResolver = resolve({
  extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.sass', '.scss'],
})

/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: 'src/index.ts',
    cache: false,
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        globals: {
          react: 'React',
        },
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        globals: {
          react: 'React',
        },
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json' }),
      postcss({
        extract: true,
        extensions: ['.less', '.css'],
        minimize: true,
      }),
      terser({ compress: true }),
      // css({
      //   //TODO 参考这个插件https://github.com/thgh/rollup-plugin-css-only/blob/v4/src/index.mjs

      //   output: function (styles, styleNodes) {
      //     // 将每个组件的样式文件写入独立的文件中
      //     Object.entries(styleNodes).forEach(([componentName, styleNode]) => {
      //       console.log('styleNode', styleNode, componentName)
      //       fs.writeFileSync(`${componentName}`, '1');
      //     });
      //   },
      // }),
      alias({
        entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
        customResolver,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts', '.tsx', '.js'],
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      }),
      extractCss(),
    ],
    external: ['react'],
  },
  {
    input: 'dist/esm/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css/, /\.less/],
  },
]
export default config
