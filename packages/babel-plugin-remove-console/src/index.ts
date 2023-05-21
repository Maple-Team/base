import type { NodePath, PluginObj } from '@babel/core'
import type t from '@babel/types'

export interface Option {
  /**
   * 排除的项，如debug、error、warn等
   */
  exclude?: string[]
}
/**
 * 移除代码中的console.xxx
 * @param param0
 * @returns
 */
export default function ({ types: t }: { types: typeof import('@babel/types') }): PluginObj {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>, state: { opts: Option }) {
        const { node } = path
        if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.object, { name: 'console' })) {
          const property = node.callee.property as t.Identifier
          if (!state.opts?.exclude?.includes(property.name)) path.remove()
        }
      },
    },
  }
}
