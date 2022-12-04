import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import alias from '@rollup/plugin-alias'
import path from 'path'

const projectRootDir = path.resolve(__dirname)

const packageJson = require('./package.json')
const customResolver = resolve({
  extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.sass', '.scss'],
})

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.build.json' }),
      postcss({
        extract: true,
        extensions: ['.less', '.css'],
      }),
      terser(),
      alias({
        entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
        customResolver,
      }),
    ],
  },
  {
    input: 'dist/esm/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
    external: [/\.css/, /\.less/],
  },
]
