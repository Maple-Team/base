import path from 'path'
import fs from 'fs'
import type { PluginObj, PluginPass } from '@babel/core'
import type {
  ArrayExpression,
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  FunctionExpression,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSXAttribute,
  MemberExpression,
  ObjectProperty,
  V8IntrinsicIdentifier,
  VariableDeclarator,
} from '@babel/types'
import { hash, isHans, save, transformKey } from './helper'

export interface Option {
  outputDir: string
}

/**
 * react组件注入t('xxx')
 * @param param0
 * @returns
 */
export default function ({ types: t, template }: AnyToFix, options: Option): PluginObj {
  return {
    name: '@liutsing/babel-plugin-auto-i18n',

    pre(file: AnyToFix) {
      file.set('allText', [])
    },
    post(file: AnyToFix) {
      const allText = file.get('allText') as { key: string; value: string }[]

      const intlData = allText.reduce((obj: Record<string, string>, item) => {
        obj[item.key] = item.value
        return obj
      }, {})

      // 文件内容被覆盖
      if (Object.keys(intlData).length) {
        const f = file.path.hub.file
        // 获取文件的绝对路径
        const absolutePath = f.opts.filename
        // TODO 字段重复处理策略
        const content = JSON.stringify(intlData, null, 4)
        fs.writeFileSync(path.join(options.outputDir, `${hash(absolutePath)}.json`), content)
      }
    },
    visitor: {
      // 处理导入代码：import { useTranslation } from 'react-i18next'
      Program: {
        enter(path, state) {
          state.hasUseTranslationImport = false
          // 检查是否已经导入了 react-i18next 中的 useTranslation
          path.node.body.forEach((node) => {
            if (t.isImportDeclaration(node) && (node as ImportDeclaration).source.value === 'react-i18next') {
              const specifiers = (node as ImportDeclaration).specifiers
              specifiers.forEach((specifier) => {
                const importSpecifier = specifier as ImportSpecifier
                if (importSpecifier.imported && (importSpecifier.imported as Identifier).name === 'useTranslation')
                  state.hasUseTranslationImport = true
              })
            }
          })
        },
        exit(path) {
          const hasUseTranslationImport =
            path.scope.hasBinding('useTranslation') || path.scope.hasBinding('initReactI18next')
          // 如果没有导入过，插入新的导入声明
          if (!hasUseTranslationImport) {
            // eslint-disable-next-line @typescript-eslint/quotes
            const importAst = template.ast("import { useTranslation } from 'react-i18next'")
            path.node.body.unshift(importAst)
          }
        },
      },
      JSXText(path, state) {
        const file = state.file
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename
        if (absolutePath?.endsWith('.svg')) return

        const i18nKey = path.node.value.trim()

        if (!isHans(i18nKey)) return

        const transformedKey = transformKey(i18nKey)
        const identifier = t.identifier(`"${transformedKey}"`)
        const expressionContainer = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [identifier]))
        // 替换文本节点为JSXExpressionContainer节点
        path.replaceWith(expressionContainer)
        save(state.file as unknown as PluginPass, transformedKey, i18nKey)
        path.skip()
      },
      StringLiteral(path, state) {
        const i18nKey = path.node.value.trim()
        if (!isHans(i18nKey)) return

        const file = state.file
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename
        const parent = path.parent

        // 排除console.xx中的中文
        const callExpressionPath = path.findParent((p) => p.isCallExpression())
        if (callExpressionPath) {
          const callee = (callExpressionPath.node as CallExpression).callee as MemberExpression
          if (t.isMemberExpression(callee)) {
            const { property, object } = callee
            if (
              t.isIdentifier(object) &&
              t.isIdentifier(property) &&
              (object as Identifier).name === 'console' &&
              ['log', 'debug', 'error', 'warn', 'info'].includes((property as Identifier).name)
            )
              return // 忽略message.xxx('<中文>')
          }
        }

        if (t.isCallExpression(parent)) {
          const callExpressionPath = parent as CallExpression
          // 处理类似message.info('<中文>')
          if (
            t.isMemberExpression(callExpressionPath.callee) &&
            ((callExpressionPath.callee as MemberExpression).object as Identifier).name
          ) {
            const transformedKey = transformKey(i18nKey)
            const identifier = t.identifier(`"${transformedKey}"`)
            const expressionContainer = t.callExpression(t.identifier('t'), [identifier])
            path.replaceWith(expressionContainer)
            save(state.file as unknown as PluginPass, transformedKey, i18nKey)
            path.skip()
          } else if (
            t.isIdentifier(callExpressionPath.callee) &&
            (callExpressionPath.callee as Identifier).name === 't'
          ) {
            // 已存在的t('xx')，忽略
          } else {
            console.debug('i18n忽略字段: ', i18nKey)
          }
        } else if (t.isJSXAttribute(parent)) {
          // jsx属性中的汉字
          if ((parent as JSXAttribute).name.name === 'id') {
            // 忽略svg中id中的中文
            return
          }

          const transformedKey = transformKey(i18nKey)
          const identifier = t.identifier(`"${transformedKey}"`)
          const expressionContainer = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [identifier]))
          path.replaceWith(expressionContainer)
          path.skip()
          save(state.file as unknown as PluginPass, transformedKey, i18nKey)
        } else if (t.isConditionalExpression(parent)) {
          // 三目运算符下的StringLiteral
          const jSXAttributePath = path.findParent((p) => p.isJSXAttribute())
          if (jSXAttributePath) {
            // jsx属性中的三目运算符中的StringLiteral
            const transformedKey = transformKey(i18nKey)
            const identifier = t.identifier(`"${transformedKey}"`)
            const expressionContainer = t.callExpression(t.identifier('t'), [identifier])
            path.replaceWith(expressionContainer)
            path.skip()
            save(state.file as unknown as PluginPass, transformedKey, i18nKey)
          }
        } else if (t.isObjectProperty(parent)) {
          const objectPropertyPath = parent as ObjectProperty
          /**
          忽略模块作用域中的
           const a = {xx:'中文'}
           export const a = {xx:'中文'}
          保留函数作用域内的(react函数组件)
           */

          const blockPath = path.findParent((path) => path.isBlockStatement())
          // NOTE 排除不在函数作用域中的中文: 其他字典类的定义按手动处理
          if (!blockPath) return

          if ((objectPropertyPath.key as Identifier).name === 'id') {
            const transformedKey = transformKey(i18nKey)
            const identifier = t.identifier(`"${transformedKey}"`)
            const expressionContainer = t.callExpression(t.identifier('t'), [identifier])
            path.replaceWith(expressionContainer)
            path.skip()
            save(state.file as unknown as PluginPass, transformedKey, i18nKey)
          } else if (t.isAssignmentExpression(parent) || t.isArrayExpression(parent)) {
            // 处理数组中的中文
            const transformedKey = transformKey(i18nKey)
            const identifier = t.identifier(`"${transformedKey}"`)
            const expressionContainer = t.callExpression(t.identifier('t'), [identifier])
            path.replaceWith(expressionContainer)
            path.skip()
            save(state.file as unknown as PluginPass, transformedKey, i18nKey)
          } else {
            // console.log({ key: i18nKey, type: parent.type }, '===未提取===')
            fs.writeFile(
              './no.log',
              `${JSON.stringify({
                key: i18nKey,
                parentType: parent.type,
                type: path.node.type,
                path: absolutePath,
              })}\r\n`,
              { flag: 'a+' },
              (e) => {
                if (e) console.error(e)
              }
            )
          }
        }
      },
      FunctionDeclaration(path) {
        // 获取文件的绝对路径
        const hasBindingT = path.scope.hasBinding('t')
        const hasBindingI18n = path.scope.hasBinding('i18n')
        let isValidJSXElement = false
        path.traverse({
          // 针对FunctionDeclaration下的 ReturnStatement
          ReturnStatement(declaratorPath) {
            const argument = declaratorPath.node.argument
            if (argument && t.isJSXElement(argument)) isValidJSXElement = true
          },
        })
        // 如果没有找到声明，我们添加一个新的声明
        if (!hasBindingT && !hasBindingI18n && isValidJSXElement) {
          const useTranslationStatement = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.objectPattern([
                t.objectProperty(t.identifier('t'), t.identifier('t')),
                t.objectProperty(t.identifier('i18n'), t.identifier('i18n')),
              ]),
              t.callExpression(t.identifier('useTranslation'), [])
            ),
          ])

          // 将声明添加到函数体的顶部
          path.node.body.body.unshift(useTranslationStatement)
        }
      },
      ArrowFunctionExpression(path) {
        const blockStatement = path.node.body as BlockStatement
        const parent = path.parent as VariableDeclarator | CallExpression

        // 确保 body 是一个 BlockStatement 类型
        if (!t.isBlockStatement(blockStatement)) return

        if (
          !t.isCallExpression(parent) &&
          (parent as CallExpression).callee &&
          ((parent as CallExpression).callee as Identifier).name !== 'forwardRef'
        )
          return

        const parentId = (parent as VariableDeclarator).id as Identifier
        // 确保在组件根目录下的ArrowFunctionExpression 内部的箭头函数都是大写开头
        // 或者useXXX钩子
        // forwardRef定义的组件
        if (
          t.isVariableDeclarator(parent) &&
          parentId.name &&
          /^[a-z]/.test(parentId.name) &&
          !parentId.name.startsWith('use')
        )
          return

        const hasBindingT = path.scope.hasBinding('t')
        const hasBindingI18n = path.scope.hasBinding('i18n')

        let isValidJSXElement = false
        path.traverse({
          // 针对ArrowFunctionExpression下的 ReturnStatement
          ReturnStatement(declaratorPath) {
            const argument = declaratorPath.node.argument
            if (argument && (t.isJSXElement(argument) || t.isJSXFragment(argument))) isValidJSXElement = true
          },
        })
        // 如果没有找到声明，我们添加一个新的声明
        // 返回正确的jsxElement或useXX钩子
        if (!hasBindingT && !hasBindingI18n && (isValidJSXElement || (parentId && parentId.name.startsWith('use')))) {
          const useTranslationStatement = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.objectPattern([
                t.objectProperty(t.identifier('t'), t.identifier('t')),
                t.objectProperty(t.identifier('i18n'), t.identifier('i18n')),
              ]),
              t.callExpression(t.identifier('useTranslation'), [])
            ),
          ])

          // 将声明添加到函数体的顶部
          blockStatement.body.unshift(useTranslationStatement)
        }
      },
      CallExpression(path) {
        // 将t添加进钩子的依赖数组中
        const calleeName = (path.node.callee as V8IntrinsicIdentifier).name
        // 检查是否是指定的 React 钩子之一
        if (['useEffect', 'useCallback', 'useMemo'].includes(calleeName)) {
          // 获取钩子的第一个参数，它应该是一个函数
          const hookFunction = path.node.arguments[0] as FunctionExpression | ArrowFunctionExpression

          // 确保第一个参数是一个函数体
          if (t.isFunctionExpression(hookFunction) || t.isArrowFunctionExpression(hookFunction)) {
            // FIXME 更有效的方法
            // 检查钩子函数体中是否包含符合条件(暂时的方法)的中文使用场景
            let hasChineseUsage = false
            path.traverse({
              StringLiteral(stringLiteralPath) {
                const value = stringLiteralPath.node.value
                if (isHans(value)) hasChineseUsage = true
              },
            })

            if (!hasChineseUsage) return
            if (
              t.isBlockStatement(hookFunction.body) ||
              (calleeName === 'useMemo' && t.isArrayExpression(hookFunction.body))
            ) {
              // 获取或创建依赖数组
              let dependencies = path.node.arguments[1] as ArrayExpression | null // path.node.arguments: [ArrowFunctionExpression, ArrayExpression|null]
              if (!dependencies) {
                dependencies = t.arrayExpression([]) as ArrayExpression
                if (t.isCallExpression(path.parent) && (path.parent as CallExpression).arguments.length > 1)
                  (path.parent as CallExpression).arguments.push(dependencies)
                else path.insertAfter(t.arrayExpression([dependencies]))
              }
              // 将 t 添加到依赖数组中，如果尚未存在
              if (!dependencies.elements.some((element) => t.isIdentifier(element, { name: 't' })))
                dependencies.elements.push(t.identifier('t'))
            }
          }
        }
      },
    },
  }
}
