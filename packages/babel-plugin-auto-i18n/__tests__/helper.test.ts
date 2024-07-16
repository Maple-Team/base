import { hash } from '@liutsing/node-utils'
import { transformKey, transformKeyWithoutHash } from '../src/helper'

// pnpm run test .\__tests__\helper.test.ts --coverage
describe('auto-i18n plugin help method', () => {
  it('hash', () => {
    expect(hash('变量1')).toBe('9e898cce023258f18c2122444daabf95f19f5308')
    expect(hash('属性值1')).toBe('e86e487cdd0fdd6fa76f6d5023ff101be42d16f4')
    expect(hash('属性值2')).toBe('3c3e23ee2bf2a7b5804c8e6a4933a69e3d202918')
  })
  it('transformKey', () => {
    expect(transformKey('变量1')).toBe('9e898cce')
    expect(transformKey('属性值1')).toBe('e86e487c')
    expect(transformKey('属性值2')).toBe('3c3e23ee')
    expect(transformKey('外层文本')).toBe('cd713656')
    expect(transformKey('嵌套文本')).toBe('7eaacb74')
    expect(transformKey('显示中文')).toBe('63e700c1')
  })
  it('transformKeyWithOutHash', () => {
    expect(transformKeyWithoutHash('变量1')).toBe('key_变量1')
    expect(transformKeyWithoutHash('属性值1')).toBe('key_属性值1')
  })
})
