/**
 * 类型判断工具函数
 * TODO 待补充工具函数及测试
 * @Author: liutsing
 * @Date: 2023-02-27 Monday 14:50
 */
type CommonObjectType = 'Symbol' | 'Date' | 'RegExp'
type BaseType = 'Function' | 'String' | 'Number' | 'Object' | 'Array' | 'Null' | 'Undefined'
type BinaryType = 'ArrayBuffer' | 'DataView'

type MapleType = BaseType | CommonObjectType | BinaryType

const tagTester = (type: MapleType) => {
  return function (value: unknown) {
    return Object.prototype.toString.call(value) === `[object ${type}]`
  }
}

export const isFunction = tagTester('Function')
export const isArray = Array.isArray || tagTester('Array')
export const isString = tagTester('String')
export const isNumber = tagTester('Number')
export const isSymbol = tagTester('Symbol')

export const isObject = tagTester('Object')
export const isNull = tagTester('Null')
export const isUndefined = tagTester('Undefined')
export const isNaN = () => {
  throw new Error('no implement error')
}

export const isRegExp = tagTester('RegExp')
export const isDate = tagTester('Date')

// binary
export const isArrayBuffer = tagTester('ArrayBuffer')
export const isDataView = tagTester('DataView')
// export const isTypedArray = tagTester('TypedArray')
