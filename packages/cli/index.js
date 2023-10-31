#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs')
const prompts = require('prompts')
const version = require('./package.json').version
const { formatTargetDir } = require('./utils')

yargs(hideBin(process.argv))
  .command('$0', 'init MapleImage colorful project', async (argv) => {
    const { help } = argv.argv
    if (help) return

    const defaultProjectName = 'project'
    let template = 'react'
    let targetDir = defaultProjectName
    const promptProjectDir = async () =>
      await prompts([
        {
          type: 'text',
          name: 'projectDir',
          initial: defaultProjectName,
          message: 'Project folder',
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultProjectName
          },
        },
      ])

    await promptProjectDir()
    let root = path.resolve(process.cwd(), targetDir)
    while (fs.existsSync(root)) {
      console.log(`${targetDir} is not empty, please choose another project name`)
      await promptProjectDir()
      root = path.resolve(process.cwd(), targetDir)
    }

    // choose template
    await prompts([
      {
        type: 'select',
        name: 'template',
        message: 'Project template', // app/lib/webpack(loader/plugin)/component(react/vue)/hooks(react/vue)
        choices: [
          { title: 'react-ts', value: 'react-ts' },
          // { title: 'vue', value: 'vue' },
        ],
        onState: (state) => {
          template = state.value
        },
      },
    ])

    fs.mkdirSync(root, { recursive: true })
    const srcFolder = path.resolve(__dirname, `template-${template}`)
    copyFolder(srcFolder, targetDir)
    // 输出帮助信息
    const pkgManager = getPkgManager()
    console.log('\nDone. Now run:\n')
    console.log(`cd ${targetDir}\n`)
    console.log(`${pkgManager} install\n`)
    console.log(`${pkgManager} run dev\n`)
  })
  .help()
  .version(version)
  .parse()

/**
 * 递归复制模板目录
 * @param {*} src
 * @param {*} dst
 */
function copyFolder(src, dst) {
  /**
   * 处理gitignore文件
   */
  const renameFiles = {
    _gitignore: '.gitignore',
  }

  fs.mkdirSync(dst, { recursive: true })
  for (const file of fs.readdirSync(src)) {
    const srcFile = path.resolve(src, file)
    const dstFile = renameFiles[file] ? path.resolve(dst, renameFiles[file]) : path.resolve(dst, file)
    const stat = fs.statSync(srcFile)
    if (stat.isDirectory()) copyFolder(srcFile, dstFile)
    else fs.copyFileSync(srcFile, dstFile)
  }
}

function getPkgManager() {
  const ua = process.env.npm_config_user_agent
  if (!ua) return 'npm'
  const [pkgInfo] = ua.split(' ')
  const [name] = pkgInfo.split('/')
  return name || 'npm'
}
