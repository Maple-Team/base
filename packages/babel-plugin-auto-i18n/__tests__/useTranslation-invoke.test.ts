import { getTransformCode } from './test-help'
// pnpm run test .\__tests__\useTranslation-invoke.test.ts --coverage

describe('function declaration scenario', () => {
  describe('hooks scenarios', () => {
    it('case1', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const var1 = "变量1"
        return [var1]
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case2', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const {i18n} = useTranslation()
        const var1 = "变量1"
        return [var1]
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case3', () => {
      const sourceCode = `
      export function useComponent(){
        const {t} = useTranslation()
        const var1 = t("key1")
        return [var1]
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  describe('detect useTranslation invoke times', () => {
    it('case 1', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke1.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case 2', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const {t, i18n} = useTranslation()
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke2.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case 3', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const {i18n} = useTranslation()
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case 4', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export function useComponent(){
        const {t} = useTranslation()
        return <div name="属性">{t('key')}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke4.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation1', () => {
      const sourceCode = `
      import {useState} from 'react'
      export function useComponent(){
        const [v, setV] = useState(0)
        return {v,setV}
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation2', () => {
      const sourceCode = `
      import {useState} from 'react'
      export function Component(){
        const [v, setV] = useState(0)
        return <>{v}</>
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation3', () => {
      const sourceCode = `
      import {useState} from 'react'
      export function Component(){
        console.log('中文')
        const [v, setV] = useState(0)
        return <>{v}</>
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation4', () => {
      const sourceCode = `
      import {useState} from 'react'
      export function Component(){
        console.log('中文')
        const [v, setV] = useState(0)
        return <div>{v}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})

describe('arrow function scenario', () => {
  describe('hooks scenarios', () => {
    it('case1', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export const useHooks1 = () => {
        const var1 = "变量1"
        return [var1]
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
  // 确保useTranslation只调用一次
  describe('detect useTranslation invoke times', () => {
    it('case 1', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export const Component = () => {
        return <div name="属性">站位文本</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke1.tsx')
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
      const result = getTransformCode(sourceCode, 'useTranslation-invoke2.tsx')
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
      const result = getTransformCode(sourceCode, 'useTranslation-invoke3.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('case 4', () => {
      const sourceCode = `
      import {useTranslation} from 'react-i18next'
      export const Component = () => {
        const {t} = useTranslation()
        return <div name="属性">{t('key')}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'useTranslation-invoke4.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation1', () => {
      const sourceCode = `
      import {useState} from 'react'
      export const Component = () => {
        const [v, setV] = useState(0)
        return {v,setV}
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation2', () => {
      const sourceCode = `
      import {useState} from 'react'
      export const Component = () => {
        console.log('中文')
        const [v, setV] = useState(0)
        return {v,setV}
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation3', () => {
      const sourceCode = `
      import {useState} from 'react'
      export const Component = () => {
        console.log('中文')
        const [v, setV] = useState(0)
        return <>{v}</>
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
    it('代码组件没有使用到中文则不调用useTranslation4', () => {
      const sourceCode = `
      import {useState} from 'react'
      export const Component = () => {
        console.log('中文')
        const [v, setV] = useState(0)
        return <div>{v}</div>
      }
      `
      const result = getTransformCode(sourceCode, 'filename.tsx')
      expect(result?.code).toMatchSnapshot()
    })
  })
})
