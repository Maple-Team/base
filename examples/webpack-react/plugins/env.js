const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const fs = require('fs') // to check if the file exists
// 参考 https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5

const getEnvKeys = (pathStr) => {
  // Set the path parameter in the dotenv config
  const env = dotenv.config({ path: pathStr })
  const fileEnv = dotenvExpand.expand(env).parsed
  // const fileEnv = dotenv.config({ path: pathStr, override: true }).parsed

  // reduce it to a nice object, the same as before (but with the variables from the file)
  // NOTE 同一文件内，后面的替换前面的

  const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next])
    return prev
  }, {})

  return envKeys
}

module.exports = (dirname) => {
  // Get the root path (assuming your webpack config is in the root of your project!)

  const mode = process.env.mode || 'dev' // 'dev, sit, pro, ...
  // Create the fallback path (the production .env)
  const basePath = dirname + '/.env'

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + '.' + mode
  const localPath = basePath + '.' + 'local'

  // Check if the file exists, otherwise fall back to the production .env

  let localEnvKeys, modeEnvKeys, baseEnvKeys

  if (fs.existsSync(localPath)) {
    localEnvKeys = getEnvKeys(localPath)
  }
  if (fs.existsSync(envPath)) {
    modeEnvKeys = getEnvKeys(envPath)
  }
  if (fs.existsSync(basePath)) {
    baseEnvKeys = getEnvKeys(basePath)
  }

  // NOTE for same key .env.local > .env.xx > .env
  return Object.assign({}, { ...baseEnvKeys }, { ...modeEnvKeys }, { ...localEnvKeys })
}
