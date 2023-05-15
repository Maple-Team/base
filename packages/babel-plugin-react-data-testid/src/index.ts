/**
 * copy and modify from @https://github.com/akameco/babel-plugin-react-data-testid/blob/master/src/index.ts
 * @Author: liutsing
 * @Date: 2023-05-15 Monday 13:37
 */
import type { NodePath, PluginObj, Visitor } from '@babel/core'
import * as t from '@babel/types'

type FunctionType = t.FunctionDeclaration | t.FunctionExpression | t.ArrowFunctionExpression

function nameForReactComponent(path: NodePath<FunctionType>): t.Identifier | null {
  const { parentPath } = path
  if (!t.isArrowFunctionExpression(path.node) && t.isIdentifier(path.node.id)) return path.node.id

  // FIXME ~
  // @ts-expect-error: 待处理
  if (t.isVariableDeclarator(parentPath)) return parentPath.node.id
  return null
}

const DEFAULT_DATA_TESTID = 'data-testid'

function createDataAttribute(name: string, attributeName: string) {
  return t.jsxAttribute(t.jsxIdentifier(attributeName), t.stringLiteral(name))
}

function hasDataAttribute(node: t.JSXOpeningElement, attributeName: string): boolean {
  return node.attributes.some(
    (attribute) => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name, { name: attributeName })
  )
}

interface VisitorState {
  name: string
  attributes: string[]
}

const returnStatementVisitor: Visitor<VisitorState> = {
  JSXFragment(path) {
    path.skip()
  },
  JSXElement(path, { name, attributes }) {
    const openingElement = path.get('openingElement')

    path.skip()

    for (const attribute of attributes) {
      if (!hasDataAttribute(openingElement.node, attribute)) {
        const dataAttribute = createDataAttribute(name, attribute)
        openingElement.node.attributes.push(dataAttribute)
      }
    }
  },
}

const functionVisitor: Visitor<VisitorState> = {
  ReturnStatement(path, state) {
    const arg = path.get('argument')
    if (!arg.isIdentifier()) path.traverse(returnStatementVisitor, state)
  },
}

interface State {
  opts: {
    attributes?: string[]
  }
}

export default function plugin(): PluginObj<State> {
  return {
    name: 'react-data-testid',
    visitor: {
      'FunctionExpression|ArrowFunctionExpression|FunctionDeclaration': (
        path: NodePath<FunctionType>,
        state: State
      ) => {
        const identifier = nameForReactComponent(path)
        if (!identifier) return

        const attributes = state.opts.attributes ?? [DEFAULT_DATA_TESTID]

        if (path.isArrowFunctionExpression()) {
          path.traverse(returnStatementVisitor, {
            name: identifier.name,
            attributes,
          })
        } else {
          path.traverse(functionVisitor, { name: identifier.name, attributes })
        }
      },
    },
  } as PluginObj<State>
}
