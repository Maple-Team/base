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
export const mkdirSafeSync = (dirname: string, options?: MkdirOptions) => {
  try {
    fs.accessSync(dirname, fs.constants.R_OK | fs.constants.W_OK)
  } catch (error) {
    fs.mkdirSync(dirname, options)
  }
}
/**
 * 安全的新建文件夹
 * @param dirname
 * @param options
 */
export const mkdirSafe = async (dirname: string, options?: MkdirOptions) => {
  try {
    fs.accessSync(dirname, fs.constants.R_OK | fs.constants.W_OK)
  } catch (error) {
    return new Promise<boolean>(function (resolve, reject) {
      fs.mkdir(dirname, options, (e2) => {
        if (e2) {
          reject(e2)
        } else {
          resolve(true)
        }
      })
    })
  }
  return true
}

/**
 * 递归查找文件
 * @param entry
 * @param target
 * @param excludes
 * @returns
 */
export const find = (entry: string, target: string, excludes: string[]) => {
  const files = fs.readdirSync(entry).filter((file) => !excludes.includes(file))
  const index = files.findIndex((file) => file.indexOf(target) > -1)
  if (index > -1) {
    console.log(`${target} found! full path is ${entry}/${files[index]}`)
    process.exit(0)
  } else {
    const dirs = files.reduce((p: string[], file) => {
      if (fs.statSync(`${entry}/${file}`).isDirectory()) {
        p.push(`${entry}/${file}`)
      }
      return p
    }, [])
    if (dirs.length !== 0) {
      // 广度优先
      for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i]
        find(dir, target, excludes)
      }
    }
  }
}
