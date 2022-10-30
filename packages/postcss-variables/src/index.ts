import { Declaration, Helpers, Plugin, PluginCreator } from 'postcss'
import Processor from 'postcss/lib/processor'
import { cssPropertyReg } from '@liutsing/regexp-utils'

// declare module 'postcss-nesting'

export interface Options {
  nestingPlugin?: string
  variables: Record<string, string>
}

const plugincssVariables: PluginCreator<Options> = (_options?: Options): Plugin | Processor => {
  const options = Object.assign({} as Options, _options)
  const replace = (decl: Declaration, { result: _result }: Helpers) => {
    const value = decl.value
    if (!value || !cssPropertyReg.test(value)) {
      return
    }
    const rawValue = options.variables[value.replace(cssPropertyReg, (_, __, p) => p)]
    const realDecl = decl.clone({ value: rawValue })
    decl.replaceWith(realDecl)
  }
  return {
    postcssPlugin: 'postcss-variables',
    Declaration: {
      'font-family': replace,
      color: replace,
    },
  }
}
plugincssVariables.postcss = true

export default plugincssVariables
