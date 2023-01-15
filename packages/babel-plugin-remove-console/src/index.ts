import { NodePath, PluginObj } from '@babel/core'
import t from '@babel/types'

export interface Option {
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (state.opts?.exclude?.includes(node.callee.property.name)) {
            path.remove()
          }
        }
      },
    },
  }
}
