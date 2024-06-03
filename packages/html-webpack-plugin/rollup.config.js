const typescript = require('@rollup/plugin-typescript')
// https://rollupjs.org/javascript-api/#outputoptions-object

/**
 * @type {import('rollup').RollupOptions}
 *
 */
module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: 'lib/index.mjs',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
}
