import cleanup from 'rollup-plugin-cleanup'

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs',
    },
  ],
  plugins: [
    cleanup({
      comments: 'none',
    }),
  ],
}
export default config
