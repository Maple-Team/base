// rollup.config.js
// umd
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const terser = require('@rollup/plugin-terser')

const common = require('./rollup.cjs')

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'umd/index.aio.js',
      format: 'umd',
      // When export and export default are not used at the same time, set legacy to true.
      // legacy: true,
      name: common.name,
      banner: common.banner,
    },
    {
      file: 'umd/index.aio.min.js',
      format: 'umd',
      // legacy: true,
      name: common.name,
      banner: common.banner,
      plugins: [terser()],
    },
  ],
  plugins: [nodeResolve({}), commonjs({}), ...common.getCompiler()],
}
