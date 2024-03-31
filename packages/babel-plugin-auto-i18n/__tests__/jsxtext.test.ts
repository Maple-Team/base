import { getTransformCode } from './test-help'

describe('arrow function declaration scenarios - JSXText cases', () => {
  describe('exported arrow function cases', () => {
    it('handle JSXText1', () => {
      const sourceCode = `
    export const Component = () => {
      return <div>你好</div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText2', () => {
      const sourceCode = `
    export const Component = () => {
      return <div>你好<span>嵌套文本</span></div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText3', () => {
      const sourceCode = `
    export const Component = () => {
      return <>
      <div>你好</div>
      <span>嵌套文本</span>
      </>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('exported default arrow function cases', () => {
    it('handle JSXText1', () => {
      const sourceCode = `
    export default () => {
      return <div>你好</div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText2', () => {
      const sourceCode = `
      export default () => {
      return <div>你好<span>嵌套文本</span></div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText3', () => {
      const sourceCode = `
      export default () => {
      return <>
      <div>你好</div>
      <span>嵌套文本</span>
      </>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})

describe('function declaration scenarios - JSXText cases', () => {
  describe('exported function cases', () => {
    it('handle JSXText1', () => {
      const sourceCode = `
    export function Component(){
      return <div>你好</div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText2', () => {
      const sourceCode = `
    export function Component(){
      return <div>你好<span>嵌套文本</span></div>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText3', () => {
      const sourceCode = `
    export function Component(){
      return <>
      <div>你好</div>
      <span>嵌套文本</span>
      </>
    }
    `
      const result = getTransformCode(sourceCode, 'jsxtext3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })

  describe('exported default function cases', () => {
    it('handle JSXText1', () => {
      const sourceCode = `
      export default function Component(){
        return <div>你好</div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxtext4.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText2', () => {
      const sourceCode = `
      export default function Component(){
        return <div>你好<span>嵌套文本</span></div>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxtext2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('handle JSXText3', () => {
      const sourceCode = `
      export default function Component(){
        return <>
        <div>你好</div>
        <span>嵌套文本</span>
        </>
      }
      `
      const result = getTransformCode(sourceCode, 'jsxtext3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
