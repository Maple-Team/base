import path from 'path'
import fs from 'fs'
import {
  type ArrayExpression,
  type ArrowFunctionExpression,
  type BlockStatement,
  type CallExpression,
  type FunctionExpression,
  type Identifier,
  type ImportSpecifier,
  type JSXOpeningElement,
  type MemberExpression,
  type ObjectProperty,
  type Statement,
  type V8IntrinsicIdentifier,
  type VariableDeclarator,
} from '@babel/types'
import { isChinese } from '@liutsing/utils'
import { hash } from '@liutsing/node-utils'
import type * as BabelCoreNamespace from '@babel/core'
import { save, transformKey, transformKeyWithoutHash } from './helper'

type Babel = typeof BabelCoreNamespace

export interface Option {
  /**
   * 中文文案输出目录
   * @default string path.join(process.cwd(), 'src','i18n','zh_CN')
   */
  outputDir?: string
  debug?: boolean
  /**
   * 提取/转化符合条件的语言文案
   * @param text
   * @default {import('./helper').isHans}
   * @returns
   */
  conditionalLanguage?: (text: string) => boolean
  /**
   * hash函数
   */
  hashFn?: (text: string) => string
  /**
   * 父节点信息debug
   */
  stringLiteralParentTypeDebug?: boolean
  /**
   * 需要删除id的节点名称
   */
  needDeleteAttributeElementNames?: string[]
}
/**
 * react组件注入t('xxx')
 * @param param0
 * @returns
 */
export default function ({ types: t, template }: Babel, options: Option): BabelCoreNamespace.PluginObj {
  const conditionalLanguage = options.conditionalLanguage || isChinese
  const outputDir = options.outputDir || path.join(process.cwd(), 'src', 'i18n', 'zh_CN')
  const defaultHashFn = process.env.NODE_ENV === 'development' ? transformKeyWithoutHash : transformKey
  const hashFn = options.hashFn || defaultHashFn
  const debug = options.debug
  const stringLiteralParentTypeDebug = options.stringLiteralParentTypeDebug
  const needIgnoreIdAttributeElementNames = options.needDeleteAttributeElementNames || ['g', 'path']
  /**
   * 节点替换
   * @param i18nKey
   * @param path
   * @param state
   */
  function replaceWithCallExpression(
    i18nKey: string,
    path: BabelCoreNamespace.NodePath,
    state: BabelCoreNamespace.PluginPass
  ) {
    if (stringLiteralParentTypeDebug) console.log(i18nKey, path.parent.type)

    const transformedKey = hashFn(i18nKey)
    const identifier = t.identifier(`"${transformedKey}"`)
    const expressionContainer = t.callExpression(t.identifier('t'), [identifier])
    path.replaceWith(expressionContainer)
    path.skip()
    save(state, transformedKey, i18nKey)
  }

  /**
   * StringLiteral是否处于console.xxx调用的上下文中
   * @param declarationPath
   * @returns
   */
  function isConsoleCallExpression(declarationPath: BabelCoreNamespace.NodePath) {
    const callExpressionPath = declarationPath.findParent((p) => p.isCallExpression())
    if (callExpressionPath) {
      const callee = (callExpressionPath.node as CallExpression).callee as MemberExpression
      if (t.isMemberExpression(callee)) {
        const { property, object } = callee
        if (
          t.isIdentifier(object) &&
          t.isIdentifier(property) &&
          object.name === 'console' &&
          ['log', 'debug', 'error', 'warn', 'info'].includes(property.name)
        )
          return true
      }
      return false
    }
    return false
  }

  const obj: BabelCoreNamespace.PluginObj = {
    name: '@liutsing/babel-plugin-auto-i18n',
    pre(this) {
      this.set('allText', [])
    },
    post(this, file: BabelCoreNamespace.BabelFile) {
      const allText = this.get('allText') as { key: string; value: string }[]
      const intlData = allText.reduce((obj: Record<string, string>, item) => {
        obj[item.key] = item.value
        return obj
      }, {})
      // 文件内容被覆盖
      if (Object.keys(intlData).length) {
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename || ''
        // TODO 字段重复处理策略
        const content = JSON.stringify(intlData, null, 4)
        const outputFilename = debug ? absolutePath.replace(/[:\\\/\.\s]/g, '-') : hash(absolutePath)
        fs.writeFileSync(path.join(outputDir, `${outputFilename}.json`), content)
      }
    },
    visitor: {
      // 处理导入代码：import { useTranslation } from 'react-i18next'
      Program: {
        enter(path, state) {
          state.hasUseTranslationImport = false
          // 检查是否已经导入了 react-i18next 中的 useTranslation
          path.node.body.forEach((node) => {
            if (t.isImportDeclaration(node) && node.source.value === 'react-i18next') {
              const specifiers = node.specifiers
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
            const importAst = template.ast('import { useTranslation } from "react-i18next"') as Statement
            path.node.body.unshift(importAst)
          }
        },
      },
      JSXAttribute(path) {
        const JSXOpeningElementPath = path.findParent((p) =>
          p.isJSXOpeningElement()
        ) as BabelCoreNamespace.NodePath<JSXOpeningElement> | null
        const elementName = t.isJSXIdentifier(JSXOpeningElementPath?.node.name)
          ? JSXOpeningElementPath?.node.name.name || ''
          : ''
        // 检查是否是JSXAttribute节点
        if (path.node.name.name === 'id' && needIgnoreIdAttributeElementNames.includes(elementName)) {
          // 获取字符串字面量的值
          const stringValue = t.isStringLiteral(path.node?.value) ? path.node.value.value : ''
          if (conditionalLanguage(stringValue)) path.remove()
        }
      },
      JSXText(path, state) {
        const file = state.file
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename
        if (absolutePath?.endsWith('.svg')) {
          // 使用webpack require context导入的svg文件，需要忽略其内部的中文的处理
          return
        }
        const i18nKey = path.node.value.trim()
        if (!conditionalLanguage(i18nKey)) return
        if (stringLiteralParentTypeDebug) console.log(i18nKey, path.parent.type)
        const transformedKey = hashFn(i18nKey)
        const identifier = t.identifier(`"${transformedKey}"`)
        const expressionContainer = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [identifier]))
        // 替换文本节点为JSXExpressionContainer节点
        path.replaceWith(expressionContainer)
        save(state, transformedKey, i18nKey)
        path.skip()
      },
      StringLiteral(path, state) {
        const i18nKey = path.node.value.trim()
        if (!conditionalLanguage(i18nKey)) return
        const file = state.file
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename
        const parent = path.parent
        // console.log(i18nKey, parent.type)
        // NOTE 忽略console.xxx('<中文>')
        if (isConsoleCallExpression(path)) return
        // TODO console.xxx({pro:'<中文>'})
        if (t.isCallExpression(parent)) {
          const callExpressionPath = parent
          // 处理类似message.info('<中文>')

          if (
            (t.isMemberExpression(callExpressionPath.callee) &&
              (callExpressionPath.callee.object as Identifier).name) ||
            (t.isIdentifier(callExpressionPath.callee) && callExpressionPath.callee.name !== 't')
          ) {
            replaceWithCallExpression(i18nKey, path, state)
          } else if (t.isIdentifier(callExpressionPath.callee) && callExpressionPath.callee.name === 't') {
            // TODO 测试
            // 已存在的t('xx')，忽略
          } else {
            if (options.debug) {
              console.log('the unhandled chinese text of callExpression condition: ', {
                key: i18nKey,
                type: parent.type,
                absolutePath,
              })
            }
          }
        } else if (t.isJSXAttribute(parent)) {
          // jsx属性中的汉字
          if (parent.name.name === 'id') {
            if (options.debug) {
              // 忽略svg中id中的中文
              console.log('ignore the text of svg dom', i18nKey)
            }
            return
          }
          const transformedKey = hashFn(i18nKey)
          if (stringLiteralParentTypeDebug) console.log(i18nKey, path.parent.type)
          const identifier = t.identifier(`"${transformedKey}"`)
          const expressionContainer = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [identifier]))
          path.replaceWith(expressionContainer)
          path.skip()
          save(state, transformedKey, i18nKey)
        } else if (t.isObjectProperty(parent)) {
          /**
          忽略模块作用域中的
           const a = {xx:'中文'}
           export const a = {xx:'中文'}
          保留函数作用域内的(react函数组件)
           */
          const blockPath = path.findParent((path) => path.isBlockStatement())
          // NOTE 排除不在函数作用域中的中文: 其他字典类的定义按手动处理
          if (!blockPath) return
          // NOTE react组件中的svg内的id  插件在webpack中使用，走了两种节点遍历：JSXAttribute/StringLiteral
          // NOTE 原因：@babel/preset-react处理这个jsx语法，JSXAttribute转变为ObjectExpression
          // NOTE 先走了JSXAttribute遍历，已经删除了id="xxx" 这个节点
          // if (t.isIdentifier(parent.key) && parent.key.name === 'id') return
          replaceWithCallExpression(i18nKey, path, state)
        } else if (
          t.isAssignmentExpression(parent) ||
          t.isArrayExpression(parent) ||
          t.isJSXExpressionContainer(parent) ||
          t.isLogicalExpression(parent) ||
          t.isBinaryExpression(parent) ||
          t.isConditionalExpression(parent)
        ) {
          replaceWithCallExpression(i18nKey, path, state)
        } else if (t.isVariableDeclarator(parent)) {
          const blockPath = path.findParent((path) => path.isBlockStatement())
          if (!blockPath) return
          replaceWithCallExpression(i18nKey, path, state)
        } else {
          if (options.debug) {
            console.log('unmatched condition: ', {
              key: i18nKey,
              type: parent.type,
              absolutePath,
            })
          }
        }
      },
      TemplateElement(path, state) {
        const i18nKey = path.node.value.raw.trim()
        if (!conditionalLanguage(i18nKey)) return
        replaceWithCallExpression(i18nKey, path, state)
      },
      FunctionDeclaration(path) {
        let isValidJSXElement = false
        let hasUseTranslationVariableDeclarator: BabelCoreNamespace.NodePath<VariableDeclarator> | undefined
        let hasConditionalLanguageText = false
        path.traverse({
          // 针对FunctionDeclaration下的 ReturnStatement
          ReturnStatement(declaratorPath) {
            const argument = declaratorPath.node.argument
            if (argument && (t.isJSXElement(argument) || t.isJSXFragment(argument))) isValidJSXElement = true
          },
          VariableDeclarator(declaratorPath) {
            // 找到useTranslation的VariableDeclarator
            if (t.isCallExpression(declaratorPath.node.init)) {
              if (
                t.isIdentifier(declaratorPath.node.init.callee) &&
                declaratorPath.node.init.callee.name === 'useTranslation'
              )
                hasUseTranslationVariableDeclarator = declaratorPath
            }
          },
          TemplateElement(declaratorPath) {
            const value = declaratorPath.node.value.raw.trim()
            if (!hasConditionalLanguageText) hasConditionalLanguageText = conditionalLanguage(value)
          },
          JSXText(declaratorPath) {
            const value = declaratorPath.node.value.trim()
            // jsxFragment返回的多个子节点，考虑到会重复执行，如果有一次遍历到就ok
            if (!hasConditionalLanguageText) hasConditionalLanguageText = conditionalLanguage(value)
          },
          StringLiteral(declaratorPath) {
            const value = declaratorPath.node.value.trim()
            // TODO 很多需要排除的
            if (!isConsoleCallExpression(declaratorPath))
              if (conditionalLanguage(value)) hasConditionalLanguageText = true
          },
        })

        const functionNameNode = path.node.id
        const hasBindingT = path.scope.hasBinding('t')
        const hasBindingI18n = path.scope.hasBinding('i18n')

        // NOTE 不是是返回一个jsx element或函数名以use开头，则不需要注入
        if (isValidJSXElement || functionNameNode?.name.startsWith('use')) {
          if (!hasUseTranslationVariableDeclarator) {
            const objectPropertyT = !hasBindingT ? t.objectProperty(t.identifier('t'), t.identifier('t')) : null
            const objectPropertyI18n = hasBindingI18n
              ? t.objectProperty(t.identifier('i18n'), t.identifier('i18n'))
              : null
            const objectProperties = [objectPropertyT, objectPropertyI18n].filter(Boolean) as ObjectProperty[]

            // NOTE 没有符合条件的语言文案，则不需要注入
            if (!hasConditionalLanguageText) return
            const useTranslationStatement = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.objectPattern(objectProperties),
                t.callExpression(t.identifier('useTranslation'), [])
              ),
            ])
            // 将声明添加到函数体的顶部
            path.node.body.body.unshift(useTranslationStatement)
          } else {
            // 源码中已存在useTranslation调用
            const id = hasUseTranslationVariableDeclarator.node.id
            if (t.isObjectPattern(id)) {
              const properties = id.properties as ObjectProperty[]
              if (!hasBindingT) properties.push(t.objectProperty(t.identifier('t'), t.identifier('t')))
            }
          }
        }
      },
      ArrowFunctionExpression(path) {
        const blockStatement = path.node.body as BlockStatement
        const parent = path.parent as VariableDeclarator | CallExpression

        // 确保 body 是一个 BlockStatement 类型
        if (!t.isBlockStatement(blockStatement)) return

        if (
          !t.isCallExpression(parent) &&
          (parent as unknown as CallExpression).callee &&
          ((parent as unknown as CallExpression).callee as Identifier).name !== 'forwardRef'
        )
          return

        const parentId = (parent as VariableDeclarator).id as Identifier
        let hasConditionalLanguageText = false
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
        let useTranslationVariableDeclarator: BabelCoreNamespace.NodePath<VariableDeclarator> | undefined

        let isValidJSXElement = false
        path.traverse({
          // 针对ArrowFunctionExpression下的 ReturnStatement
          ReturnStatement(declaratorPath) {
            const argument = declaratorPath.node.argument
            if (argument && (t.isJSXElement(argument) || t.isJSXFragment(argument))) isValidJSXElement = true
          },
          VariableDeclarator(declaratorPath) {
            // 找到useTranslation的VariableDeclarator
            if (t.isCallExpression(declaratorPath.node.init)) {
              if (
                t.isIdentifier(declaratorPath.node.init.callee) &&
                declaratorPath.node.init.callee.name === 'useTranslation'
              )
                useTranslationVariableDeclarator = declaratorPath
            }
          },
          TemplateElement(declaratorPath) {
            const value = declaratorPath.node.value.raw.trim()
            if (!hasConditionalLanguageText) hasConditionalLanguageText = conditionalLanguage(value)
          },
          JSXText(declaratorPath) {
            const value = declaratorPath.node.value.trim()
            if (!hasConditionalLanguageText) hasConditionalLanguageText = conditionalLanguage(value)
          },
          StringLiteral(declaratorPath) {
            const value = declaratorPath.node.value.trim()
            // TODO 很多需要排除的
            if (!isConsoleCallExpression(declaratorPath))
              if (conditionalLanguage(value)) hasConditionalLanguageText = true
          },
        })
        // NOTE 不是返回一个jsx element或函数名以use开头，则不需要注入
        if (isValidJSXElement || parentId?.name.startsWith('use')) {
          if (!useTranslationVariableDeclarator) {
            const objectPropertyT = !hasBindingT ? t.objectProperty(t.identifier('t'), t.identifier('t')) : null
            const objectPropertyI18n = hasBindingI18n
              ? t.objectProperty(t.identifier('i18n'), t.identifier('i18n'))
              : null
            const objectProperties = [objectPropertyT, objectPropertyI18n].filter(Boolean) as ObjectProperty[]
            // NOTE 没有符合条件的语言文案，则不需要注入
            if (!hasConditionalLanguageText) return
            const useTranslationStatement = t.variableDeclaration('const', [
              t.variableDeclarator(
                t.objectPattern(objectProperties),
                t.callExpression(t.identifier('useTranslation'), [])
              ),
            ])
            // 将声明添加到函数体的顶部
            blockStatement.body.unshift(useTranslationStatement)
          } else {
            // 源码中已存在useTranslation调用
            const id = useTranslationVariableDeclarator.node.id
            if (t.isObjectPattern(id)) {
              const properties = id.properties as ObjectProperty[]
              if (!hasBindingT) properties.unshift(t.objectProperty(t.identifier('t'), t.identifier('t')))
            }
          }
        }
      },
      CallExpression(path) {
        // 将t添加进hooks的依赖数组中
        const calleeName = (path.node.callee as V8IntrinsicIdentifier).name
        // 检查是否是指定的 React hooks之一
        if (!['useEffect', 'useCallback', 'useMemo'].includes(calleeName)) return
        // 获取hooks的第一个参数，它应该是一个函数
        const hookFunction = path.node.arguments[0] as FunctionExpression | ArrowFunctionExpression

        // 确保第一个参数是一个函数体
        if (!(t.isFunctionExpression(hookFunction) || t.isArrowFunctionExpression(hookFunction))) return
        // FIXME 更有效的方法
        // 检查hooks函数体中是否包含符合条件(暂时的方法)的中文使用场景
        let hasChineseUsage = false
        path.traverse({
          StringLiteral(stringLiteralPath) {
            // 排除console.log
            if (isConsoleCallExpression(stringLiteralPath)) {
              hasChineseUsage = false
              return
            }
            const value = stringLiteralPath.node.value.trim()
            if (conditionalLanguage(value)) hasChineseUsage = true
          },
          JSXText(jsxTextPath) {
            const value = jsxTextPath.node.value.trim()
            if (conditionalLanguage(value)) hasChineseUsage = true
          },
        })
        // hooks函数参数的作用域中无中文
        if (!hasChineseUsage) return
        if (
          t.isBlockStatement(hookFunction.body) ||
          (calleeName === 'useMemo' && t.isArrayExpression(hookFunction.body))
        ) {
          // 获取或创建依赖数组
          // path.node.arguments: [ArrowFunctionExpression, ArrayExpression|null]
          const dependencies = path.node.arguments[1] as ArrayExpression | null
          if (!dependencies) {
            // NOTE 当前hooks无依赖数组项，默认每次都重新执行，不添加t函数进依赖数组
            return
            // dependencies = t.arrayExpression([])
            // if (t.isCallExpression(path.parent) && path.parent.arguments.length > 1)
            //   path.parent.arguments.push(dependencies)
            // else path.insertAfter(t.arrayExpression([dependencies]))
          }
          // 将 t 添加到依赖数组中，如果尚未存在
          if (!dependencies.elements.some((element) => t.isIdentifier(element, { name: 't' })))
            dependencies.elements.push(t.identifier('t'))
        }
      },
    },
  }
  return obj
}
