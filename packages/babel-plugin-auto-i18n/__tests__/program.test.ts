import { getTransformCode } from './test-help'

describe('detect has import react-i18n', () => {
  it('case 1', () => {
    const sourceCode = `
    import {useTranslation} from 'react-i18next'
    export const Component = () => {
      return <div name="属性">站位文本</div>
    }
    `
    const result = getTransformCode(sourceCode, 'imported-i18n1.tsx')
    expect(result?.code).toMatchSnapshot()
  })
  it('case 2', () => {
    const sourceCode = `
    export const Component = () => {
      return <div name="属性">站位文本</div>
    }
    `
    const result = getTransformCode(sourceCode, 'imported-i18n2.tsx')
    expect(result?.code).toMatchSnapshot()
  })
})
