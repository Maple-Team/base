/*
 * @Description: 一些常用的文件操作库
 * @Author: Liutsing
 */
import * as fs from 'fs'
import type { MakeDirectoryOptions } from 'fs'

type MkdirOptions = fs.MakeDirectoryOptions & {
  recursive: true
}

/**
 * 安全的同步新建文件夹
 * @param dirname
 * @param options
 */

export const mkdirSafeSync = (dirname: string, option?: MakeDirectoryOptions) => {
  // try {
  //   fs.accessSync(dirname, fs.constants.R_OK | fs.constants.W_OK)
  // } catch (error) {
  //   fs.mkdirSync(dirname, options)
  // }
  const exists = fs.existsSync(dirname)
  if (!exists) fs.mkdirSync(dirname, option)

  return fs.existsSync(dirname)
}
/**
 * 安全的新建文件夹
 * @param dirname
 * @param options
 */
export const mkdirSafe = async (dirname: string, options?: MkdirOptions) => {
  const exists = fs.existsSync(dirname)
  if (exists) return true
  return new Promise<boolean>((resolve, reject) => {
    fs.mkdir(dirname, options, (e) => {
      if (e) reject(e)
      else resolve(true)
    })
  })
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
      if (fs.statSync(`${entry}/${file}`).isDirectory()) p.push(`${entry}/${file}`)

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
