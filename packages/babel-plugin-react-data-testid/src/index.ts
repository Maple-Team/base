/**
 * copy and modify from @https://github.com/akameco/babel-plugin-react-data-testid/blob/master/src/index.ts
 * @Author: liutsing
 * @Date: 2023-05-15 Monday 13:37
 */
import type { NodePath, PluginObj, Visitor } from '@babel/core'
import type {
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  JSXOpeningElement,
} from '@babel/types'

type FunctionType = FunctionDeclaration | FunctionExpression | ArrowFunctionExpression

function nameForReactComponent(path: NodePath<FunctionType>, t: typeof import('@babel/types')): Identifier | null {
  const { parentPath } = path
  //  e.isArrowFunctionExpression is not a function
  if (!t.isArrowFunctionExpression(path.node) && t.isIdentifier(path.node.id)) return path.node.id

  // FIXME ~
  // @ts-expect-error: 待处理
  if (t.isVariableDeclarator(parentPath)) return parentPath.node.id
  return null
}

const DEFAULT_DATA_TESTID = 'data-testid'

function createDataAttribute(name: string, attributeName: string, t: typeof import('@babel/types')) {
  return t.jsxAttribute(t.jsxIdentifier(attributeName), t.stringLiteral(name))
}

function hasDataAttribute(node: JSXOpeningElement, attributeName: string, t: typeof import('@babel/types')): boolean {
  return node.attributes.some(
    (attribute) => t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name, { name: attributeName })
  )
}

interface VisitorState {
  name: string
  attributes: string[]
  t: typeof import('@babel/types')
}

const returnStatementVisitor: Visitor<VisitorState> = {
  JSXFragment(path) {
    path.skip()
  },
  JSXElement(path, { name, attributes, t }) {
    const openingElement = path.get('openingElement')

    path.skip()

    for (const attribute of attributes) {
      if (!hasDataAttribute(openingElement.node, attribute, t)) {
        const dataAttribute = createDataAttribute(name, attribute, t)
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

export default function plugin(t: typeof import('@babel/types')): PluginObj<State> {
  return {
    name: 'react-data-testid',
    visitor: {
      'FunctionExpression|ArrowFunctionExpression|FunctionDeclaration': (
        path: NodePath<FunctionType>,
        state: State
      ) => {
        const identifier = nameForReactComponent(path, t)
        if (!identifier) return

        const attributes = state.opts.attributes ?? [DEFAULT_DATA_TESTID]

        if (path.isArrowFunctionExpression()) {
          path.traverse(returnStatementVisitor, {
            name: identifier.name,
            attributes,
            t,
          })
        } else {
          path.traverse(functionVisitor, { name: identifier.name, attributes, t })
        }
      },
    },
  } as PluginObj<State>
}
