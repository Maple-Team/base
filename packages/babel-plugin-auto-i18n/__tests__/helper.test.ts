import { transformKey } from '../src/helper'

describe('auto-i18n plugin help method', () => {
  it('transformKey', () => {
    expect(transformKey('变量1')).toBe('9e898cce')
    expect(transformKey('属性值1')).toBe('e86e487c')
    expect(transformKey('属性值2')).toBe('3c3e23ee')
  })
})
