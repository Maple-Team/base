import { getTransformCode } from './test-help'
// pnpm run test .\__tests__\useTranslation-invoke.test.ts --coverage

describe('function declaration scenario', () => {
  it('function declaration - useHooks', () => {
    const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const var1 = "变量1"
        return [var1]
      }
      `
    const result = getTransformCode(sourceCode, 'function-declaration-hooks.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  describe('detect has import react-i18n', () => {
    it('case 4', () => {
      const sourceCode = `
        import {useTranslation} from 'react-i18next'
        export function Component(){
          const {i18n} = useTranslation()
          return <div name="属性">站位文本</div>
        }
        `
      const result = getTransformCode(sourceCode, 'imported-i18n4.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
describe('detect has import react-i18n', () => {
  it('case 1', () => {
    const sourceCode = `
    import {useTranslation} from 'react-i18next'
    export const Component = () => {
      return <div name="属性">站位文本</div>
    }
    `
    const result = getTransformCode(sourceCode, 'imported-i18n.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case 2', () => {
    const sourceCode = `
    import {useTranslation} from 'react-i18next'
    export const Component = () => {
      const {t, i18n} = useTranslation()
      return <div name="属性">站位文本</div>
    }
    `
    const result = getTransformCode(sourceCode, 'imported-i18n2.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case 3', () => {
    const sourceCode = `
    import {useTranslation} from 'react-i18next'
    export const Component = () => {
      const {i18n} = useTranslation()
      return <div name="属性">站位文本</div>
    }
    `
    const result = getTransformCode(sourceCode, 'imported-i18n3.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
