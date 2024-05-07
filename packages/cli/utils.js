import path from 'path'
import fs from 'fs'

/**
 * 异步拷贝文件夹
 * @param {string} src
 * @param {string} dest
 * @param {(file:string)=>void | undefined} cb
 */
function copyFolder(src, dest, cb) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err

    fs.readdir(src, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        if (file === 'node_modules') return
        const srcPath = path.join(src, file)
        const destPath = path.join(dest, file)

        if (fs.statSync(srcPath).isDirectory()) {
          copyFolder(srcPath, destPath) // 递归拷贝子目录
        } else {
          if (cb) cb(file, srcPath, destPath)
          else fs.copyFileSync(srcPath, destPath) // 拷贝文件
        }
      })
    })
  })
}

export { copyFolder }
