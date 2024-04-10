import type { PluginObj } from '@babel/core'
import { isChinese } from '@liutsing/utils'

export interface Option {
  name: string
}

export default function (
  { types: t, template }: { types: typeof import('@babel/types'); template: AnyToFix },
  options: Option
): PluginObj {
  const name = options.name

  return {
    name: '@liutsing/babel-plugin',
    visitor: {
      JSXAttribute(path) {
        let elementName
       try{
        const JSXOpeningElementPath = path.findParent((p) => p.isJSXOpeningElement())
        elementName = JSXOpeningElementPath?.node.name.name
       }catch(e){
        console.error(e)
       }
        // 检查是否是JSXAttribute节点
        if (path.node.name.name === 'id'&&['g','path'].includes(elementName)) {
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
