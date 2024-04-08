import { getTransformCode } from './test-help'

describe('arrow function declaration scenarios - templateElement cases', () => {
  describe('exported arrow function cases', () => {
    it('handle templateElement case 1', () => {
      const sourceCode = `
        export const Component = () => {
          return <div>{\`你好\`}</div>
        }`
      const result = getTransformCode(sourceCode, 'filename1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
