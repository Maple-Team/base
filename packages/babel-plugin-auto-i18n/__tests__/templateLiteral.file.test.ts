import { readFileSync } from 'fs'
import { resolve } from 'path'
import { hash } from '@liutsing/node-utils'
import { getTransformCode } from './test-help'

describe('arrow function declaration scenarios - templateLiteral cases', () => {
  it('handle templateLiteral file case 1', () => {
    const sourceCode = readFileSync(resolve(__dirname, './templateLiteral.file.tsx')).toString()

    const result = getTransformCode(sourceCode, `${hash(sourceCode)}.tsx`, true)
    expect(result?.code).toMatchSnapshot()
  })
})
