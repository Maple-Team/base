module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: 'cjs',
        targets: {
          node: 16,
        },
      },
    ],
    '@babel/preset-typescript',
  ],
}
