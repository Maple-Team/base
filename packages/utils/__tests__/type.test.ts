import {
  isArray,
  isArrayBuffer,
  isDate,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isUndefined,
} from '@/types'

// TODO 浏览器测试
describe('type utils tests', () => {
  const waittingArr = [
    [],
    null,
    undefined,
    {},
    0,
    '',
    true,
    new Date(),
    Symbol('123'),
    new ArrayBuffer(1),
    /a/,
    () => {},
  ]

  describe('isArray type tests', () => {
    const objIndex = 0
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Array %o', (obj, bool) => {
      expect(isArray(obj)).toBe(bool)
    })
  })
  describe('isDate type tests', () => {
    const objIndex = 7
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Date %o', (obj, bool) => {
      expect(isDate(obj)).toBe(bool)
    })
  })
  describe('isRegExp type tests', () => {
    const objIndex = 10
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is RegExp %o', (obj, bool) => {
      expect(isRegExp(obj)).toBe(bool)
    })
  })
  describe('isArrayBuffer type tests', () => {
    const objIndex = 9
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is ArrayBuffer %o', (obj, bool) => {
      expect(isArrayBuffer(obj)).toBe(bool)
    })
  })
  describe('isFunction type tests', () => {
    const objIndex = 11
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Function %o', (obj, bool) => {
      expect(isFunction(obj)).toBe(bool)
    })
  })
  describe('isNumber type tests', () => {
    const objIndex = 4
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Number %o', (obj, bool) => {
      expect(isNumber(obj)).toBe(bool)
    })
  })
  describe('isString type tests', () => {
    const objIndex = 5
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is String %o', (obj, bool) => {
      expect(isString(obj)).toBe(bool)
    })
  })
  describe('isNull type tests', () => {
    const objIndex = 1
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Null %o', (obj, bool) => {
      expect(isNull(obj)).toBe(bool)
    })
  })
  describe('isUndefine type tests', () => {
    const objIndex = 2
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Undefine %o', (obj, bool) => {
      expect(isUndefined(obj)).toBe(bool)
    })
  })
  describe('isObject type tests', () => {
    const objIndex = 3
    it.concurrent.each([
      [waittingArr[objIndex], true],
      ...waittingArr.filter((_, index) => index !== objIndex).map((item) => [item, false]),
    ])('%s is Object %o', (obj, bool) => {
      expect(isObject(obj)).toBe(bool)
    })
  })
})
