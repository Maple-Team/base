const fs = require('fs') // to check if the file exists
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
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
/**
 * 提取前缀为REACT_APP_的环境变量给到browser环境使用
 * @param {*} dirname
 * @returns
 */
module.exports = (dirname) => {
  const envPrefix = 'REACT_APP_'
  /**
   * 当前系统的环境变量+cross-env注入的环境变量
   */
  const injectEnvs = Object.keys(process.env)
  const injectEnvsKeys = injectEnvs.filter((k) => k.startsWith(envPrefix))
  // Get the root path (assuming your webpack config is in the root of your project!)

  const mode = process.env.mode || 'dev' // 'dev, sit, pro, ...
  // Create the fallback path (the production .env)
  const basePath = `${dirname}/.env`

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = `${basePath}.${mode}`
  const localPath = `${basePath}.` + `local`

  // Check if the file exists, otherwise fall back to the production .env

  let localEnvKeys, modeEnvKeys, baseEnvKeys

  if (fs.existsSync(localPath)) localEnvKeys = getEnvKeys(localPath)

  if (fs.existsSync(envPath)) modeEnvKeys = getEnvKeys(envPath)

  if (fs.existsSync(basePath)) baseEnvKeys = getEnvKeys(basePath)

  // NOTE for same key .env.local > .env.xx > .env
  const envFilesEnvsObj = Object.assign({}, { ...baseEnvKeys }, { ...modeEnvKeys }, { ...localEnvKeys })
  const envFilesEnvsKeys = Object.keys(envFilesEnvsObj).filter((k) => k.includes(envPrefix))
  /**
   * @type {Record<string, string>}
   */
  const envKeys = {}
  injectEnvsKeys.forEach((k) => {
    envKeys[`process.env.${k.replace(envPrefix, '')}`] = JSON.stringify(process.env[k])
  })
  envFilesEnvsKeys.forEach((k) => {
    envKeys[k.replace(envPrefix, '')] = envFilesEnvsObj[k]
  })

  return envKeys
}
