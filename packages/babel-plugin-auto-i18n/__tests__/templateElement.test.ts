import { getTransformCode } from './test-help'

describe('arrow function declaration scenarios - templateElement cases', () => {
  describe('exported arrow function cases', () => {
    it('handle templateElement case 1', () => {
      const sourceCode = `
        export const Component = () => {
          const var1 = \`我好\`
          return <div>{\`你好\`}</div>
        }`
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle templateElement case 2', () => {
      const sourceCode = `
        export const Component = () => {
          const var1 = \`我好\`
          console.log(\`不好\`)
          return <div>{\`你好\`}</div>
        }`
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle templateElement case 3', () => {
      const sourceCode = `
        export const Component = () => {
          const var1 = \`我好\`
          console.log(\`不好\`)
          console.log({
            a: \`不好\`
          })
          return <div>{\`你好\`}</div>
        }`
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle templateElement wrapper with jsxFragment case 1', () => {
      const sourceCode = `
        export const Component = () => {
          const var1 = \`我好\`
          return <><div>{\`你好\`}</div></>
        }`
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle templateElement wrapper with jsxFragment case 2', () => {
      const sourceCode = `
        export const Component = () => {
          const var1 = \`我好\`
          return <></>
        }`
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
