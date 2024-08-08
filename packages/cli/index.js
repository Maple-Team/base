#!/usr/bin/env node

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import inquirer from 'inquirer'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { copyFolder } from './utils.js'

// 使用 yargs 解析命令行参数
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]') // 显示用法
  .option('v', {
    // 添加 -v 或 --version 选项
    describe: 'Show version number',
    type: 'boolean',
  })
  .option('h', {
    // 添加 -h 或 --help 选项
    alias: 'help',
    describe: 'Show help information',
    type: 'boolean',
  })
  .command(
    'init',
    'Initialize a new project',
    (yargs) => {
      // 添加一个子命令 init
      return yargs.option('name', {
        describe: 'Project name',
        type: 'string',
      })
    },
    async (args) => {
      // 当执行 'init' 子命令时，可以在这里处理参数
      if (args) {
        // 启动 inquirer 提示
        const __filename = fileURLToPath(import.meta.url)
        const __dirname = dirname(__filename)

        inquirer
          .prompt([
            {
              type: 'input',
              name: 'packageName',
              message: 'Input target folder',
              validate(value) {
                const pass = value.match(/[^\/\s\.]/i)
                if (pass) return true
                return 'Please enter a valid folder name'
              },
            },
            {
              type: 'list',
              message: 'Select project type',
              name: 'projectType',
              choices: [
                new inquirer.Separator('===Web App==='),
                {
                  name: 'React',
                },
                // TODO 待补充
              ],
              validate(answer) {
                if (answer.length === 0) return 'You must choose at least one type.'
                return true
              },
            },
          ])
          .then((answers) => {
            const target = path.join(process.cwd(), answers.packageName)
            const source = path.join(__dirname, 'templates', answers.projectType.toLowerCase())
            copyFolder(source, target, (file, srcPath, destPath) => {
              if (file === '_gitignore') fs.copyFileSync(srcPath, destPath.replace(/_gitignore/g, '.gitignore'))
              else if (file === '_npmrc') fs.copyFileSync(srcPath, destPath.replace(/_npmrc/g, '.npmrc'))
              else if (file === '_editorconfig')
                fs.copyFileSync(srcPath, destPath.replace(/_editorconfig/g, '.editorconfig'))
              else fs.copyFileSync(srcPath, destPath)
            })
          })
      }
    }
  )
  .help() // 显示帮助信息
  .alias('h', 'help')
  .version().argv // 显示版本信息

// 检查是否需要显示版本或帮助信息
if (argv.v || argv.version) console.log(`Version V0.1.1-beta.8`)
else if (argv.h || argv.help) yargs.showHelp()
