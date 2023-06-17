import type {
  IBaseDef,
  MergeIntersection,
  ToKeyMap,
  ToKeyValue,
  ToKeys,
  ToProperty,
  ToValueKey,
  ToValueMap,
  ToValues,
} from '@liutsing/types-utils'
/**
 *
 * 字典相关的工具类
 * @https://juejin.cn/post/7187963986875252795
 *
 * 输入：[{ key: 'a', value: '1' },
      { key: 'b', value: '2' }]
  调用举例：  const defs = [
      {
        key: 'a',
        value: '1',
      },
      {
        key: 'b',
        value: '2',
      },
    ] as const
    const res = defineConstants(defs, 'PRE')
 * 输出： {
      KEYS: [ 'a', 'b' ],
      VALUES: [ '1', '2' ],
      KV: { a: '1', b: '2' },
      VK: { '1': 'a', '2': 'b' },
      MAP_BY_KEY: { a: { key: 'a', value: '1' }, b: { key: 'b', value: '2' } },
      MAP_BY_VALUE: { '1': { key: 'a', value: '1' }, '2': { key: 'b', value: '2' } },
      MAP: { a: '1', b: '2' },
      LIST: [ { key: 'a', value: '1' }, { key: 'b', value: '2' } ]
    }
 * @param defs
 * @param namespace
 * @returns
 */
export function defineConstants<T extends readonly IBaseDef[], N extends string = ''>(defs: T, namespace?: N) {
  const prefix = namespace ? `${namespace}_` : ''
  return {
    [`${prefix}KEYS`]: defs.map((item) => item.key),
    [`${prefix}VALUES`]: defs.map((item) => item.value),
    [`${prefix}KV`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.key]: item.value,
      }),
      {}
    ),
    [`${prefix}VK`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.value]: item.key,
      }),
      {}
    ),
    [`${prefix}MAP_BY_KEY`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.key]: item,
      }),
      {}
    ),
    [`${prefix}MAP_BY_VALUE`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.value]: item,
      }),
      {}
    ),
    [`${prefix}MAP`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.key]: item.value,
      }),
      {}
    ),
    /** 原始输入 */
    [`${prefix}LIST`]: defs,
  } as MergeIntersection<
    {
      [Key in ToProperty<'KV', N>]: ToKeyValue<T>
    } & {
      [Key in ToProperty<'VK', N>]: ToValueKey<T>
    } & {
      [Key in ToProperty<'KEYS', N>]: ToKeys<T>
    } & {
      [Key in ToProperty<'VALUES', N>]: ToValues<T>
    } & {
      [Key in ToProperty<'MAP_BY_KEY', N>]: ToKeyMap<T>
    } & {
      [Key in ToProperty<'MAP_BY_VALUE', N>]: ToValueMap<T>
    } & {
      [Key in ToProperty<'MAP', N>]: ToKeyValue<T>
    } & {
      [Key in ToProperty<'LIST', N>]: T
    }
  >
}

// 使用举例
// const defs = [
//   {
//     key: 'a',
//     value: '1',
//   },
//   {
//     key: 'b',
//     value: '2',
//   },
// ] as const

// const { VALUES, KEYS } = defineConstants(defs)
// export type ValueType = (typeof VALUES)[number] // "1" | "2"
// export type KeyType = (typeof KEYS)[number] // "a" | "b"
