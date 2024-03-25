import { getTransformCode } from './help'

describe('auto i18n plugin', () => {
  it('handle JSXText', () => {
    const sourceCode = `
    export const Component = () => {
      return <div>你好</div>
    }
    `
    const result = getTransformCode(sourceCode)
    console.log(result?.code)
    expect(result?.code).toMatchSnapshot()
  })
  it('handle JSXAttribute', () => {
    const sourceCode = `
    export const Component = () => {
      return <div name="属性">jsx文本</div>
    }
    `
    const result = getTransformCode(sourceCode)
    console.log(result?.code)
    expect(result?.code).toMatchSnapshot()
  })
})
