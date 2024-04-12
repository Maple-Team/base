import { getTransformCode } from './test-help'

it('handle JSXText with comments', () => {
  const sourceCode = `
  export const Component = () => {
    return <div>{/*@i18n-ignore*/'你好'}<span>{/*@i18n-ignore*/}你好</span></div>
  }
`
  const result = getTransformCode(sourceCode, 'filename.tsx')
  expect(result?.code).toMatchSnapshot()
})

it('handle stringLiteral with comments', () => {
  const sourceCode = `
  export const Component = () => {
    const var1 = /*@i18n-ignore*/'你好'
    return <div>你好</div>
  }
`
  const result = getTransformCode(sourceCode, 'filename.tsx')
  expect(result?.code).toMatchSnapshot()
})

it('handle templateElement with comments', () => {
  const sourceCode = `
  export const Component = () => {
    const var1 = /*@i18n-ignore*/\`templateElement你好\`;
    return <div>你好</div>
  }
`
  const result = getTransformCode(sourceCode, 'filename.tsx')
  expect(result?.code).toMatchSnapshot()
})
