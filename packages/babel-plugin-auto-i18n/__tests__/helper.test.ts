import { transformKey } from '../src/helper'

describe('auto-i18n plugin help method', () => {
  it('transformKey', () => {
    expect(transformKey('变量1')).toBe('9e898cce')
    expect(transformKey('属性值1')).toBe('e86e487c')
    expect(transformKey('属性值2')).toBe('3c3e23ee')
    expect(transformKey('外层文本')).toBe('cd713656')
    expect(transformKey('嵌套文本')).toBe('7eaacb74')
    expect(transformKey('显示中文')).toBe('63e700c1')
  })
})
