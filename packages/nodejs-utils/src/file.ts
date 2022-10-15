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
  if (!fs.statSync(dirname)) {
    fs.mkdirSync(dirname, options)
  }
}
/**
 * 安全的新建文件夹
 * @param dirname
 * @param options
 */
export const mkdirSafe = async (dirname: string, options: MkdirOptions) => {
  if (!fs.statSync(dirname)) {
    return new Promise<void>(function (resolve, reject) {
      fs.mkdir(dirname, options, (e2) => {
        if (e2) {
          reject(e2)
        } else {
          resolve()
        }
      })
    })
  }
}