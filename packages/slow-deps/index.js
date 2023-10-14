#!/usr/bin/env node

'use strict'

if (!global.Promise) global.Promise = require('lie')

const fs = require('fs')
const path = require('path')
const temp = require('temp')
const exec = require('child-process-promise').exec
const denodeify = require('denodeify')
const shellEscape = require('any-shell-escape')
const extend = require('js-extend').extend

const mkdir = denodeify(temp.mkdir)
const readFile = denodeify(fs.readFile)
const readdir = denodeify(fs.readdir)
const stat = denodeify(fs.stat)
const writeFile = denodeify(fs.writeFile)
const appendFile = denodeify(fs.appendFile)
const now = require('performance-now')
const ProgressBar = require('progress')
const getFolderSize = denodeify(require('get-folder-size'))
const prettierBytes = require('prettier-bytes')
const prettyMs = require('pretty-ms')
const tablify = require('tablify').tablify
const sum = require('math-sum')
const ncp = denodeify(require('ncp'))
const yargs = require('yargs')

temp.track()

const argv = yargs
  .usage('Usage: $0 [options]')

  .boolean('production')
  .describe('production', 'Skip devDependencies')
  .alias('production', 'prod')

  .boolean('no-optional')
  .describe('no-optional', 'Skip optionalDependencies')

  .boolean('no-shrinkwrap')
  .describe('no-shrinkwrap', 'Ignore npm-shrinkwrap.json')

  .example('$0', 'measure all deps in the current project')
  .example('$0 --production --no-optional', 'skip both optional and dev dependencies')

  .help('help')
  .alias('h', 'help').argv

function formatPlural(num, strSingular, strPlural) {
  return `${num} ${num === 1 ? strSingular : strPlural}`
}

/**
 * 读取当前项目的依赖信息
 * @returns
 */
function getDeps() {
  return readFile('package.json', 'utf8')
    .then((str) => {
      const pkgJson = JSON.parse(str)
      const deps = extend({}, pkgJson.dependencies)
      let devSkipped = 0
      let optionalSkipped = 0
      // Include devDependencies only if --production is absent
      if (!argv.production) extend(deps, pkgJson.devDependencies)
      else devSkipped = Object.keys(pkgJson.devDependencies || {}).length

      // Include optionalDependencies only if --no-optional argument is absent.
      // Note that yargs parses "--no-*" deps in a special way, hence this `!== false` check.
      if (argv.optional !== false) extend(deps, pkgJson.optionalDependencies)
      else optionalSkipped = Object.keys(pkgJson.optionalDependencies || {}).length

      let startMessage = `Analyzing ${Object.keys(deps).length} dependencies`
      if (devSkipped && optionalSkipped) {
        startMessage += ` (skipping ${formatPlural(devSkipped, 'devDependency', 'devDependencies')} and ${formatPlural(
          optionalSkipped,
          'optionalDependency',
          'optionalDependencies'
        )})`
      } else if (devSkipped) {
        startMessage += ` (skipping ${formatPlural(devSkipped, 'devDependency', 'devDependencies')})`
      } else if (optionalSkipped) {
        startMessage += ` (skipping ${formatPlural(optionalSkipped, 'optionalDependency', 'optionalDependencies')})`
      }
      startMessage += '...'
      console.log(startMessage)
      return deps
    })
    .catch(() => {
      throw new Error('No package.json in the current directory.')
    })
}

/**
 * 读取锁版本文件中的依赖信息
 * @returns
 */
function getLockDeps() {
  return stat('package-lock.json')
    .then((file) => {
      if (argv.shrinkwrap !== false && file.isFile()) {
        return readFile('package-lock.json', 'utf8').then((str) => {
          return JSON.parse(str).dependencies || {}
        })
      }
      return {}
    })
    .catch((e) => {
      console.error(e)
      return {}
    })
}

function createEmptyNpmrc(dir) {
  return writeFile(path.join(dir, '.npmrc'), '', 'utf8')
}

function setupNpmrc(toDir) {
  // copy .npmrc from current directory if possible
  return stat('.npmrc')
    .then((file) => {
      if (file.isFile()) return ncp('.npmrc', path.join(toDir, '.npmrc'))

      return createEmptyNpmrc(toDir)
    })
    .catch(() => {
      return createEmptyNpmrc(toDir)
    })
}

/**
 * 创建package-lock.json文件
 * @param {*} dir
 * @param {*} dep
 * @returns
 */
function createNpmPackageLockwrap(dir, dep) {
  return writeFile(path.join(dir, 'package-lock.json'), JSON.stringify(dep), 'utf8')
}
/**
 * 创建package.json文件
 * @param {*} dir
 * @param {*} dep
 * @param {*} version
 * @returns
 */
function createPackageJson(dir, dep, version) {
  const content = `{ "dependencies": { "${dep}": "${version}" } }`
  return writeFile(path.join(dir, 'package.json'), content, 'utf8')
}
/**
 * 执行npm安装分析逻辑
 * @param {*} deps
 * @param {*} lockDeps
 * @returns
 */
function doNpmInstalls(deps, lockDeps) {
  let promise = Promise.resolve()
  const bar = new ProgressBar('[:bar] :percent :etas', {
    total: Object.keys(deps).length,
    width: 20,
  })
  const times = []

  /**
   * 递归安装依赖并收集分析结果
   * @param {*} dep
   * @param {*} version
   * @param {*} dir
   * @returns
   */
  function install(dep, version, dir) {
    const cache = path.join(dir, '.cache')
    const nodeModules = path.join(dir, 'node_modules')

    return setupNpmrc(dir)
      .then(() => {
        // set the cache to a local cache directory
        return appendFile(path.join(dir, '.npmrc'), `\ncache=${cache}`, 'utf8')
      })
      .then(() => {
        if (!lockDeps[dep]) return

        return createNpmPackageLockwrap(dir, lockDeps[dep])
      })
      .then(() => {
        return createPackageJson(dir, dep, version)
      })
      .then(() => {
        const start = now()
        return exec(shellEscape(['npm', 'install']), {
          cwd: dir,
          env: process.env,
        }).then(() => {
          const totalTime = now() - start
          return getFolderSize(nodeModules).then((size) => {
            return readdir(nodeModules).then((subDeps) => {
              times.push({
                time: totalTime,
                size,
                dep,
                subDeps: subDeps.length - 1,
              })
              bar.tick()
            })
          })
        })
      })
  }

  Object.keys(deps).forEach((dep) => {
    const version = deps[dep]
    promise = promise.then(() => mkdir('')).then((dir) => install(dep, version, dir))
  })
  return promise.then(() => report(times))
}
/**
 * 输出结果报告
 * @param {*} times
 */
function report(times) {
  times = times.sort((a, b) => {
    return b.time - a.time
  })
  const header = ['Dependency', 'Time', 'Size', '# Deps']
  const table = [header].concat(
    times.map((time) => {
      return [time.dep, prettyMs(time.time), prettierBytes(time.size), time.subDeps]
    })
  )
  console.log(
    tablify(table, {
      show_index: false,
      has_header: true,
    })
  )
  console.log(
    `Total time (non-deduped): ${prettyMs(
      sum(
        times.map((time) => {
          return time.time
        })
      )
    )}`
  )
  console.log(
    `Total size (non-deduped): ${prettierBytes(
      sum(
        times.map((time) => {
          return time.size
        })
      )
    )}`
  )
}

Promise.all([getDeps(), getLockDeps()])
  .then((results) => {
    const deps = results[0]
    const lockwrap = results[1]
    return doNpmInstalls(deps, lockwrap)
  })
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    console.error(err.stack)
    process.exit(1)
  })
