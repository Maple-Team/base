import type { NodePath, PluginObj } from '@babel/core'
import * as t from '@babel/types'

export interface Option {
  /**
   * 排除的项，如debug、error、warn等
   */
  exclude?: string[]
}
const injectNode = (container: (NodePath<t.Node> | NodePath<t.Node>[]) & t.BlockStatement, name?: string) => {
  if (name) {
    const countStatement = t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('console'), t.identifier('count')), [t.stringLiteral(name)])
    )
    // @ts-expect-error: TODO类型问题
    container.unshiftContainer('body', countStatement)
  }
}
/**
 * react组件注入console.count('xxxx')
 * @param param0
 * @returns
 */
export default function (): PluginObj {
  return {
    name: '@liutsing/babel-plugin-console-count',
    visitor: {
      ArrowFunctionExpression(path) {
        if (t.isExportDefaultDeclaration(path.parent)) {
          // @ts-expect-error: xx
          const componentName = path.hub.file.opts.filename || 'AnonymousComponent'
          const container = path.get('body')
          if (t.isBlockStatement(container)) injectNode(container, componentName)
        } else {
          const parent = path.findParent((p) => {
            return t.isCallExpression(p.node) && t.isIdentifier(p.node.callee, { name: 'memo' })
          })

          if (parent) {
            if (t.isVariableDeclarator(parent.parentPath?.node)) {
              const id = parent.parentPath?.node?.id
              if (t.isIdentifier(id)) {
                const container = path.get('body')
                if (t.isBlockStatement(container)) injectNode(container, id.name)
              }
            }
          }
        }
      },
      VariableDeclaration(path: NodePath<t.VariableDeclaration>) {
        let componentName: string | undefined
        if (t.isExportNamedDeclaration(path.parent)) {
          const declaration = path.node.declarations[0]
          if (t.isVariableDeclarator(declaration)) {
            if (t.isIdentifier(declaration.id)) {
              componentName = declaration.id.name
              const container = path.get('declarations.0.init.body')
              if (t.isBlockStatement(container)) injectNode(container, componentName)
            }
          }
        }
      },
    },
  }
}
