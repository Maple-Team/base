import { writeFileSync } from 'node:fs'
import os from 'node:os'
import nodePath from 'node:path'
import type t from '@babel/types'
import type { NodePath, PluginObj } from '@babel/core'

export interface Option {
  filename: string
}
const check = (filename?: string) => {
  if (!filename) throw new TypeError('注: babel插件@liutsing/babel-plugin-extract-used-chinese的参数filename不能为空')
}
const extract = (path: NodePath<t.StringLiteral> | NodePath<t.JSXText>, filename?: string) => {
  check(filename)
  const { node } = path
  const outputPath = nodePath.resolve(os.tmpdir(), filename!)
  const valueArr = node.value.split('')
  const extractedTexts = valueArr.filter((char) => /\p{Script=Han}/u.test(char))
  writeFileSync(outputPath, extractedTexts.join(''), { flag: 'a+' })
}
/**
 * 提取jsx中的汉字
 * @param param0
 * @returns
 */
export default function (_: ThisType<Option>, options: Option): PluginObj {
  const filename = options.filename
  return {
    visitor: {
      JSXText(path: NodePath<t.JSXText>) {
        extract(path, filename)
      },
      StringLiteral(path: NodePath<t.StringLiteral>) {
        const { parent } = path
        if (parent.type === 'ObjectProperty' && parent.key.type === 'Identifier' && parent.key.name === 'id') {
          /* empty */
        } else if (
          parent.type === 'JSXAttribute' &&
          parent.name.type === 'JSXIdentifier' &&
          parent.name.name === 'id'
        ) {
          /* empty */
        } else {
          extract(path, filename)
        }
      },
    },
  }
}
