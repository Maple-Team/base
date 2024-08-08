import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const version = JSON.parse(fs.readFileSync(path.resolve(root, './package.json'), { encoding: 'utf-8' })).version

console.log('当前版本:', version)

let sourceContent = fs.readFileSync(path.resolve(root, './index.js'), { encoding: 'utf-8' }).toString()
// 更新版本信息
sourceContent = sourceContent.replace(/Version .*\d/, `Version V${version}`)

// 更新文件
fs.writeFileSync(path.resolve(root, './index.js'), sourceContent, { encoding: 'utf-8' })

// 提交更改到 Git
execSync('git add .')
execSync('git commit -m "Update version"')

const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
console.log('当前 Git 分支名:', currentBranch)

// 提交更改到 Git
execSync(`git push --follow-tags origin ${currentBranch}`)
