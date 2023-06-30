import dotenv from 'dotenv'
import fs from 'fs'

// 参考 https://trekinbami.medium.com/using-environment-variables-in-react-6b0a99d83cf5
const getEnvKeys = (pathStr: string, options?: Options): Record<string, string> => {
  // Set the path parameter in the dotenv config
  const fileEnvObj: Record<string, string> | undefined = dotenv.config({ path: pathStr }).parsed
  if (!fileEnvObj) {
    return {}
  }
  // reduce it to a nice object, the same as before (but with the variables from the file)
  // NOTE 同一文件内，后面的替换前面的
  const prefix = options?.prefix || 'process.env.'
  const envKeys: Record<string, string> = Object.keys(fileEnvObj).reduce((prev: Record<string, string>, next) => {
    prev[`${prefix}${next}`] = JSON.stringify(fileEnvObj[next])
    return prev
  }, {})

  return envKeys
}
/**
 * 额外配置
 */
export interface Options {
  /**
   * 环境变量前缀
   */
  prefix?: string
}
/**
 * 获取合并的环境变量
 * @param dirname env环境文件所在目录
 * @returns
 */
export const envVariables = (dirname: string, options?: Options): Record<string, string> => {
  // Get the root path (assuming your webpack config is in the root of your project!)
  /**
   * cross-env 注入的mode
   */
  const mode = process.env.mode || 'dev' // 'dev, sit, pro, ...
  // Create the fallback path (the production .env)
  const basePath = dirname + '/.env'

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + '.' + mode
  const localPath = basePath + '.' + 'local'

  // Check if the file exists, otherwise fall back to the production .env

  let localEnvKeys, modeEnvKeys, baseEnvKeys

  if (fs.existsSync(localPath)) {
    localEnvKeys = getEnvKeys(localPath, options)
  }
  if (fs.existsSync(envPath)) {
    modeEnvKeys = getEnvKeys(envPath, options)
  }
  if (fs.existsSync(basePath)) {
    baseEnvKeys = getEnvKeys(basePath, options)
  }

  // NOTE for same key .env.local > .env.xx > .env
  return Object.assign({}, { ...baseEnvKeys }, { ...modeEnvKeys }, { ...localEnvKeys })
}
