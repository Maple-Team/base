import { isChinese } from '@liutsing/utils'
import type * as BabelCoreNamespace from '@babel/core'
import type { JSXOpeningElement } from '@babel/types'

type Babel = typeof BabelCoreNamespace

export interface Option {
  name: string
}

export default function ({ types: t, template: _template }: Babel, options: Option): BabelCoreNamespace.PluginObj {
  const name = options.name

  return {
    name: '@liutsing/babel-plugin',
    visitor: {
      JSXAttribute(path) {
        const JSXOpeningElementPath = path.findParent((p) =>
          p.isJSXOpeningElement()
        ) as BabelCoreNamespace.NodePath<JSXOpeningElement> | null
        const elementName = t.isJSXIdentifier(JSXOpeningElementPath?.node.name)
          ? JSXOpeningElementPath?.node.name.name || ''
          : ''
        // 检查是否是JSXAttribute节点
        if (path.node.name.name === 'id' && ['g', 'path'].includes(elementName)) {
          // 获取字符串字面量的值
          const stringValue = t.isStringLiteral(path.node.value) ? path.node.value.value : ''
          if (isChinese(stringValue)) path.remove()
        }
      },
      StringLiteral(path) {
        const value = path.node.value
        if (isChinese(value)) {
          const parent = path.parent
          console.log(path.node.value, parent.type, name)
        }
        // FIXME 执行次数问题
        path.skip()
      },
    },
  }
}
