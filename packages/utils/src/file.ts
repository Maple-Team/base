/*
 * @Description: 一些常用的文件操作库
 * @Author: Liutsing
 */
import * as fs from 'fs'
type MkdirOptions = fs.MakeDirectoryOptions & {
  recursive: true
}

/**
 * 安全的同步新建文件夹
 * @param dirname
 * @param options
 */
export const mkdirSyncSafe = (dirname: string, options: MkdirOptions) => {
  try {
    fs.accessSync(dirname, fs.constants.W_OK | fs.constants.R_OK)
  } catch (error) {
    fs.mkdirSync(dirname, options)
  }
}
/**
 * 安全的新建文件夹
 * @param dirname
 * @param options
 */
export const mkdirSafe = async (dirname: string, options: MkdirOptions) => {
  return new Promise<void>(function (resolve, reject) {
    fs.access(dirname, fs.constants.W_OK | fs.constants.R_OK, (e1) => {
      if (e1) {
        reject(e1)
      } else {
        new Promise<void>(function (resolve, reject) {
          return fs.mkdir(dirname, options, (e2) => {
            if (e2) {
              reject(e2)
            } else {
              resolve()
            }
          })
        })
          .then(resolve)
          .catch(reject)
      }
    })
  })
}
