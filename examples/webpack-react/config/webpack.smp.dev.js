const threadLoader = require('thread-loader')
const config = require('./webpack.dev')

threadLoader.warmup(
  {
    workers: require('os').cpus().length,
    poolTimeout: Infinity,
  },
  [
    'babel-loader',
    'less-loader',
    'style-loader',
    'css-loader',
    'postcss-loader',
    'svgo-loader',
    'css-modules-typescript-loader',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ]
)

const smpConfig = smp.wrap(config)

module.exports = smpConfig
