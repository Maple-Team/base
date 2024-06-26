import path from 'path'
import fs from 'fs'
import generate from '@babel/generator'
import { isChinese } from '@liutsing/utils'
import { hash, mkdirSafeSync } from '@liutsing/node-utils'
import type * as BabelCoreNamespace from '@babel/core'
import zip from 'lodash.zip'
import type {
  ArrayExpression,
  ArrowFunctionExpression,
  BlockStatement,
  CallExpression,
  FunctionExpression,
  Identifier,
  ImportSpecifier,
  JSXOpeningElement,
  ObjectProperty,
  Statement,
  V8IntrinsicIdentifier,
  VariableDeclarator,
} from '@babel/types'
import { save, transformKey, transformKeyWithoutHash } from './helper'
import type { Option } from './helper'

/**
 * console具有的方法属性
 */
const CONSOLE_METHODS: string[] = []
for (const i in console) if (Object.prototype.hasOwnProperty.call(console, i)) CONSOLE_METHODS.push(i)

type Babel = typeof BabelCoreNamespace

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
  const i18nIgnoreLabel = options.i18nIgnoreCommentsLabel || '@i18n-ignore'
  const shouldInjectDataI18nAttribute = options.shouldInjectDataI18nAttribute
  const dataI18nAttributeName = options.dataI18nAttributeName || 'data-i18n'

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
  function isUnderConsoleCallExpression(declarationPath: BabelCoreNamespace.NodePath) {
    const callExpressionPath = declarationPath.findParent((p) => p.isCallExpression())
    if (!callExpressionPath) return false
    const callee = (callExpressionPath.node as CallExpression).callee
    if (!t.isMemberExpression(callee)) return false
    const { property, object } = callee
    if (!t.isIdentifier(object)) return false
    if (!t.isIdentifier(property)) return false
    if (object.name !== 'console') return false
    if (CONSOLE_METHODS.includes(property.name)) return true
    return false
  }
  /**
   * 给JSXOpeningElement注入data-i18n的JSXAttribute
   * @param value
   * @param path
   */
  const elementInjectAttributesCB = (value: string, path: JSXOpeningElement) => {
    const i18nAttribute = path.attributes.find(
      (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === dataI18nAttributeName
    )
    if (i18nAttribute) {
      const existI18nValues =
        t.isJSXAttribute(i18nAttribute) && t.isStringLiteral(i18nAttribute.value)
          ? (JSON.parse(i18nAttribute.value.value) as string[])
          : []
      existI18nValues.push(hashFn(value))
      if (t.isJSXAttribute(i18nAttribute)) {
        // 更新属性的值
        i18nAttribute.value = t.stringLiteral(JSON.stringify(existI18nValues))
      }
    } else {
      // 没有data-i18n 创建一个新的属性, 使用数组存储使用到的i18nKey
      const newAttribute = t.jsxAttribute(
        t.jsxIdentifier(dataI18nAttributeName),
        t.stringLiteral(JSON.stringify([hashFn(value)]))
      )
      // 将新属性添加到现有属性列表的末尾
      path.attributes.push(newAttribute)
    }
  }

  type InjectAttributesCB = typeof elementInjectAttributesCB

  // 每个文件都会走一遍
  // fs.unlinkSync(path.join(outputDir, 'report.log'))

  const obj: BabelCoreNamespace.PluginObj = {
    name: '@liutsing/babel-plugin-auto-i18n',
    pre(this) {
      this.set('allText', [])
    },
    /**
     * 将文件内提取到的文案写入文件
     * @param this
     * @param file
     */
    post(this, file: BabelCoreNamespace.BabelFile) {
      const allText = this.get('allText') as { key: string; value: string }[]
      const intlData = allText.reduce((obj: Record<string, string>, item) => {
        obj[item.key] = item.value
        return obj
      }, {})
      // 文件内容被覆盖
      if (Object.keys(intlData).length) {
        mkdirSafeSync(outputDir)
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename || ''
        const content = JSON.stringify(intlData, null, 4)
        const escapeFileName = absolutePath.replace(/[:\\\/\.\s]/g, '-')
        const outputFilename = debug ? escapeFileName : hash(absolutePath)
        // 输出扫描报告
        fs.writeFile(
          path.join(outputDir, 'report.log'),
          `${JSON.stringify(
            {
              path: escapeFileName,
              data: intlData,
            },
            null,
            4
          )}\r\n`,
          { flag: 'a+' },
          (e) => {
            if (e) throw e
          }
        )
        fs.writeFile(path.join(outputDir, `${outputFilename}.json`), content, (e) => {
          if (e) throw e
        })
      }
    },
    visitor: {
      //
      /**
       * 处理导入代码：import { useTranslation } from 'react-i18next'
       */
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
          path.traverse({
            'StringLiteral|TemplateLiteral': function (path) {
              if (path.node.leadingComments) {
                // 顺带删除注释
                path.node.leadingComments = path.node.leadingComments.filter((comment) => {
                  if (comment.value.includes(i18nIgnoreLabel)) {
                    if (!path.node.extra) path.node.extra = {}
                    path.node.extra.skipTransform = true
                    return false
                  }
                  return true
                })
              }
            },
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
      /**
       * i18n提取替换
       * @param path
       * @param state
       * @returns
       */
      JSXText(path, state) {
        if (path.node.extra?.skipTransform) return
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
        const JSXOpeningElement = t.isJSXElement(path.parent) ? path.parent.openingElement : null
        // console.log('JSXOpeningElement', JSXOpeningElement, transformedKey)
        if (JSXOpeningElement && shouldInjectDataI18nAttribute) {
          // 方式1
          const elementInjectAttributesCB = JSXOpeningElement.extra?.elementInjectAttributesCB as InjectAttributesCB
          elementInjectAttributesCB?.(i18nKey, JSXOpeningElement)
          // FIXME 方式2 -> 多执行了一次
          // if (!JSXOpeningElement.extra) JSXOpeningElement.extra = {}
          // JSXOpeningElement.extra.i18nKey = transformedKey
        }

        const expressionContainer = t.jsxExpressionContainer(t.callExpression(t.identifier('t'), [identifier]))
        // 替换文本节点为JSXExpressionContainer节点
        path.replaceWith(expressionContainer)
        save(state, transformedKey, i18nKey)
        path.skip()
      },
      /**
       * i18n提取替换
       * @param path
       * @param state
       * @returns
       */
      TemplateLiteral(path, state) {
        if (path.node.extra?.skipTransform) {
          path.skip()
          return
        }
        // 忽略console.log()调用
        if (isUnderConsoleCallExpression(path)) return
        // 不执行子节点TemplateElement
        const value = path
          .get('quasis')
          .map((item) => item.node.value.raw)
          .filter(Boolean) // [ '车牌号: ', ', ' ]
        // 筛选符合条件的文案
        if (!conditionalLanguage(value.join(','))) return

        const interpolationLength = value.length
        // key1 key2 ...
        const keys = Array.from({ length: interpolationLength }, (_, i) => `{{key${i + 1}}}`)
        const combineValue = Array.prototype.concat.apply([], zip(value, keys)).join('')
        if (!combineValue && !conditionalLanguage(combineValue)) return
        // console.log(combineValue)
        const rawKey = value.join('')
        const key = hashFn(rawKey)

        save(state, key, combineValue)
        const expressionParams = path.isTemplateLiteral()
          ? path.node.expressions.map((item) => generate(item).code)
          : null
        // console.log(expressionParams) //    [ 'plateNo', 'price' ]
        // t('key', {key1: '', key2: '', ...})
        const params = expressionParams?.map((v, index) => `key${index + 1}: ${v}`)
        const statement = template.ast(`t('${key}'${params?.length ? `,{${params.join(',')}}` : ''})`) as Statement
        path.replaceWith(statement)
        path.skip()
        // data-i18n节点注入
        if (!shouldInjectDataI18nAttribute) return
        const JSXElement = path.findParent((el) => el.isJSXElement())

        if (JSXElement) {
          const JSXOpeningElement = t.isJSXElement(JSXElement.node) ? JSXElement.node.openingElement : null
          if (!JSXOpeningElement) return
          // 在jsx节点下
          const elementInjectAttributesCB = JSXOpeningElement.extra?.elementInjectAttributesCB as InjectAttributesCB
          elementInjectAttributesCB?.(rawKey, JSXOpeningElement)
        } else {
          // TODO 区分是否在jsxElement中使用了国际化的变量
          console.log('[非JSXElement下的文本]: ', rawKey)
          // 提供手动截图的话，就不插入到根节点
          // 在jsx组件中
          // const blockPath = path.findParent((p) => p.isBlockStatement())
          // if (!blockPath) return
          // if (!t.isBlockStatement(blockPath.node)) return
          // const returnStatement = blockPath.node.body.find((statement) => t.isReturnStatement(statement))
          // if (!returnStatement || !t.isReturnStatement(returnStatement)) return
          // const argument = returnStatement.argument
          // if (t.isJSXElement(argument)) {
          //   if (!argument.openingElement.extra) argument.openingElement.extra = {}
          //   argument.openingElement.extra.elementInjectAttributesCB = elementInjectAttributesCB
          //   elementInjectAttributesCB?.(rawKey, argument.openingElement)
          // } else if (t.isJSXFragment(argument)) {
          //   const firstJSXElement = argument.children[0]
          //   if (!t.isJSXElement(firstJSXElement)) {
          //     // jsxFragment不存在jsxElement，则插入新增jsxElement节点
          //     const element = template.ast(`<div data-i18n=\'${JSON.stringify([rawKey])}\'></div>`, {
          //       plugins: ['jsx'],
          //     })
          //     if (!element || Array.isArray(element) || !t.isExpressionStatement(element)) return
          //     if (!t.isJSXElement(element.expression)) return
          //     ;(returnStatement.argument as JSXFragment).children.unshift(element.expression)
          //   } else {
          //     // jsxFragment下存在jsxElement，则插入data-i18n到这个jsxElement上
          //     elementInjectAttributesCB?.(rawKey, firstJSXElement.openingElement)
          //   }
          // }
          // 不在jsx组件中, 在custom hooks中，=> 手动截图
          // 由平台接口反推？应该仅支持固定文本的，不支持插槽等
        }
      },
      /**
       * i18n提取替换
       * @param path
       * @param state
       * @returns
       */
      StringLiteral(path, state) {
        if (path.node.extra?.skipTransform) return
        const i18nKey = path.node.value.trim()
        if (!conditionalLanguage(i18nKey)) return
        const file = state.file
        // 获取文件的绝对路径
        const absolutePath = file.opts.filename
        const parent = path.parent
        if (stringLiteralParentTypeDebug) console.log(i18nKey, parent.type)
        if (isUnderConsoleCallExpression(path)) return
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
            // 已存在的t('xx')，忽略
          } else {
            if (options.debug) {
              console.log('the unhandled chinese text: ', {
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
              console.log('ignore the text of svg dom: ', i18nKey)
            }
            return
          }
          // 注入的data-i18n，则忽略
          if (parent.name.name === dataI18nAttributeName) {
            // console.log('ignore dataI18nAttributeName', parent.value?.value)
            return
          }
          const transformedKey = hashFn(i18nKey)
          const JSXOpeningElement = path.findParent((p) =>
            p.isJSXOpeningElement()
          ) as BabelCoreNamespace.NodePath<JSXOpeningElement>
          if (JSXOpeningElement && shouldInjectDataI18nAttribute) {
            const elementInjectAttributesCB = JSXOpeningElement.node.extra
              ?.elementInjectAttributesCB as InjectAttributesCB
            // console.log(i18nKey, 'JSXOpeningElement elementInjectAttributesCB', JSXOpeningElement.node.extra)
            elementInjectAttributesCB?.(i18nKey, JSXOpeningElement.node)
          }
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
          // 排除不在函数作用域中的中文: 其他字典类的定义按手动处理
          if (!blockPath) return
          // react组件中的svg内的id  插件在webpack中使用，走了两种节点遍历：JSXAttribute/StringLiteral
          // 原因：@babel/preset-react处理这个jsx语法，JSXAttribute转变为ObjectExpression
          // 先走了JSXAttribute遍历，已经删除了id="xxx" 这个节点
          // 处理@babel/preset-react处理后的二次遍历问题
          if (t.isStringLiteral(parent.key) && parent.key.value === dataI18nAttributeName) return
          replaceWithCallExpression(i18nKey, path, state)
        } else if (
          t.isAssignmentExpression(parent) ||
          t.isArrayExpression(parent) ||
          t.isLogicalExpression(parent) ||
          t.isBinaryExpression(parent) ||
          t.isConditionalExpression(parent)
        ) {
          replaceWithCallExpression(i18nKey, path, state)
        } else if (t.isJSXExpressionContainer(parent)) {
          // 注入i8nKey
          const jsxElement = path.findParent((p) => p.isJSXElement())
          const JSXOpeningElement =
            jsxElement && t.isJSXElement(jsxElement.node) ? jsxElement.node?.openingElement : null
          if (JSXOpeningElement && shouldInjectDataI18nAttribute) {
            // 方式1
            const elementInjectAttributesCB = JSXOpeningElement.extra?.elementInjectAttributesCB as InjectAttributesCB
            elementInjectAttributesCB?.(i18nKey, JSXOpeningElement)
            // FIXME 方式2 -> 多执行了一次
            // if (!JSXOpeningElement.extra) JSXOpeningElement.extra = {}
            // JSXOpeningElement.extra.i18nKey = transformedKey
          }
          replaceWithCallExpression(i18nKey, path, state)
        } else if (t.isVariableDeclarator(parent)) {
          const blockPath = path.findParent((path) => path.isBlockStatement())
          if (!blockPath) return
          replaceWithCallExpression(i18nKey, path, state)
        } else if (t.isReturnStatement(parent)) {
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
      /**
       * @deprecated
       * i18n提取替换
       * @param path
       * @param state
       * @returns
       */
      TemplateElement(path, state) {
        // FIXME
        if (path.node.extra?.skipTransform) return
        // 外部的TemplateElement后面处理
        const i18nKey = path.node.value.raw.trim()
        if (!conditionalLanguage(i18nKey)) return
        // 注入t("xxx")
        replaceWithCallExpression(i18nKey, path, state)
      },
      /**
       * 移除需要删除的节点
       * @param path
       */
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
      /**
       * 在JSXOpeningElement节点上为后续插入data-i18n属性提前设置好回调函数
       * @param path
       */
      JSXOpeningElement(path) {
        if (!shouldInjectDataI18nAttribute) return
        // 方式1 回调的形式
        if (!path.node.extra) path.node.extra = {}
        path.node.extra.elementInjectAttributesCB = elementInjectAttributesCB
        // 方式2 -> 多执行了一次
        // const i18nKey = path.node.extra?.i18nKey as string | undefined
        // if(!i18nKey) return
        // elementInjectAttributesCB(i18nKey)
        // path.skip()
      },
      /**
       * 判断是否需要注入`const { t, i18n } = useTranslation()`
       * @param path
       * @returns
       */
      FunctionDeclaration(path) {
        let isValidJSXElement = false
        let hasUseTranslationVariableDeclarator: BabelCoreNamespace.NodePath<VariableDeclarator> | undefined
        let hasConditionalLanguageText = false
        path.traverse({
          // TODO 忽略svg中的id内的中文、@i18n-ignore旁的文本
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
            if (!isUnderConsoleCallExpression(declaratorPath))
              if (conditionalLanguage(value)) hasConditionalLanguageText = true
          },
        })

        const functionNameNode = path.node.id
        const hasBindingT = path.scope.hasBinding('t')
        const hasBindingI18n = path.scope.hasBinding('i18n')

        // 不是是返回一个jsx element或函数名以use开头，则不需要注入
        if (isValidJSXElement || functionNameNode?.name.startsWith('use')) {
          if (!hasUseTranslationVariableDeclarator) {
            const objectPropertyT = !hasBindingT ? t.objectProperty(t.identifier('t'), t.identifier('t')) : null
            const objectPropertyI18n = hasBindingI18n
              ? t.objectProperty(t.identifier('i18n'), t.identifier('i18n'))
              : null
            const objectProperties = [objectPropertyT, objectPropertyI18n].filter(Boolean) as ObjectProperty[]

            // 没有符合条件的语言文案，则不需要注入
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
      /**
       * 判断是否需要注入`const { t, i18n } = useTranslation()`
       * @param path
       * @returns
       */
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
          // TODO 忽略svg中的id内的中文、@i18n-ignore旁的文本
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
            if (!isUnderConsoleCallExpression(declaratorPath))
              if (conditionalLanguage(value)) hasConditionalLanguageText = true
          },
        })
        // 不是返回一个jsx element或函数名以use开头，则不需要注入
        if (isValidJSXElement || parentId?.name.startsWith('use')) {
          if (!useTranslationVariableDeclarator) {
            const objectPropertyT = !hasBindingT ? t.objectProperty(t.identifier('t'), t.identifier('t')) : null
            const objectPropertyI18n = hasBindingI18n
              ? t.objectProperty(t.identifier('i18n'), t.identifier('i18n'))
              : null
            const objectProperties = [objectPropertyT, objectPropertyI18n].filter(Boolean) as ObjectProperty[]
            // 没有符合条件的语言文案，则不需要注入
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
      /**
       * react hooks 依赖数组注入`t`
       * @param path
       * @returns
       */
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
            if (isUnderConsoleCallExpression(stringLiteralPath)) {
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
            // 当前hooks无依赖数组项，默认每次都重新执行，不添加t函数进依赖数组
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
