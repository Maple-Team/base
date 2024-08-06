module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    // postcss-env
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
