import { transformKey } from '../src/helper'
import { getTransformCode } from './help'

describe('auto i18n plugin', () => {
  it('handle JSXText', () => {
    const sourceCode = `
    export const Component = () => {
      return <div>你好</div>
    }
    `
    const result = getTransformCode(sourceCode, 'jsxtext.tsx')
    console.log(result?.code)
    expect(result?.code).toMatchSnapshot()
  })

  describe('stringLiteral', () => {
    it('handle JSXAttribute', () => {
      const sourceCode = `
      export const Component = () => {
        return <div name="属性">jsx文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxattribute.tsx')
      console.log(result?.code)
      expect(result?.code).toMatchSnapshot()
    })

    it('handle Assignment', () => {
      const sourceCode = `
      export const Component = () => {
        const var1:string = "变量1"
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'assignment.tsx')
      console.log(result?.code)
      expect(result?.code).toMatchSnapshot()
    })
    it('handle objectProperty', () => {
      const sourceCode = `
      export const Component = () => {
        const obj1 = {
          name: "属性值1",
          key: "属性值2"
        }
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'objectProperty.tsx')
      console.log(result?.code)
      expect(result?.code).toMatchSnapshot()
    })
  })
})

describe('auto-i18n plugin help method', () => {
  it('transformKey', () => {
    expect(transformKey('变量1')).toBe('9e898cce')
    expect(transformKey('属性值1')).toBe('e86e487c')
    expect(transformKey('属性值2')).toBe('3c3e23ee')
  })
})
