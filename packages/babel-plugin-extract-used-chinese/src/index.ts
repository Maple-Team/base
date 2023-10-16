import { writeFileSync } from 'node:fs'
import os from 'node:os'
import nodePath from 'node:path'
import type t from '@babel/types'
import type { NodePath, PluginObj } from '@babel/core'

export interface Option {
  app?: string
}
const check = (app?: string) => {
  if (!app) throw new TypeError('注: babel插件@ecar/babel-plugin-extract-used-chinese的参数app不能为空')
}
const extract = (path: NodePath<t.StringLiteral> | NodePath<t.JSXText>, app?: string) => {
  check(app)
  const { node } = path
  const outputPath = nodePath.resolve(os.tmpdir(), `chinese-extract-loader-${app}.txt`)
  const valueArr = node.value.split('')
  const extractedTexts = valueArr.filter((char) => /\p{Script=Han}/u.test(char))
  writeFileSync(outputPath, extractedTexts.join(''), { flag: 'a+' })
}
/**
 * 提取jsx中的汉字
 * @param param0
 * @returns
 */
export default function (api: ThisType<Option>, options: Option): PluginObj {
  const app = options.app
  return {
    visitor: {
      JSXText(path: NodePath<t.JSXText>) {
        extract(path, app)
      },
      StringLiteral(path: NodePath<t.StringLiteral>) {
        extract(path, app)
      },
    },
  }
}
