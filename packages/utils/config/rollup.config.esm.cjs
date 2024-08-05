// rollup.config.js
// ES output
const common = require('./rollup.cjs')

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      // file: 'dist/index.esm.js',
      dir: 'es',
      format: 'es',
      // When export and export default are not used at the same time, set legacy to true.
      // legacy: true,
      banner: common.banner,
      sourcemap: true,
      preserveModules: true, // indicate not create a single-file
      // preserveModulesRoot: 'src', // optional but useful to create a more plain folder structure
    },
    {
      // file: 'dist/index.mjs',
      format: 'es',
      dir: 'es',
      // legacy: true,
      banner: common.banner,
      preserveModules: true,
      sourcemap: true,
    },
  ],
  plugins: [...common.getCompiler()],
}
