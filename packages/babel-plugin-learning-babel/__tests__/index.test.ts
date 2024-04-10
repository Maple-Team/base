import { getTransformCode } from './test-help'

describe('cases', () => {
  it('case1', () => {
    const sourceCode = `
    export const str = 'VariableDeclarator测试文案'
    `
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case2', () => {
    const sourceCode = `
  export const Component = () => {
    return <div>{'jsxExpressionContainer测试文案'}</div>
  }
  `
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case3', () => {
    const sourceCode = `
  export const Component = () => {
    return <g id="g-jsx属性"></g>
  }
  `
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case4', () => {
    const sourceCode = `
  export const Component = () => {
    return <div class="div-类名"></div>
  }
  `
    const result = getTransformCode(sourceCode, 'filename.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
