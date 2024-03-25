// 参考来源：@https://juejin.cn/post/7187963986875252795
/**
 * 基础属性
 */
export interface IBaseDef {
  key: PropertyKey
  value: string | number
}

/**
 * 字段前缀类型
 */
export type ToPropertyPrefix<N extends string = ''> = N extends '' ? '' : `${N}_`
/**
 * 字段类型
 *
 * ToProperty<'bar', 'foo'>将返回'foo_bar'，而ToProperty<'baz'>将返回'baz'。
 */
export type ToProperty<Property extends string, N extends string = ''> = `${ToPropertyPrefix<N>}${Property}`

/**
 * 从一个包含key属性的元组类型中提取所有key属性的名称，并返回一个字符串类型的数组
 *
 * 它接受一个元组类型T，并返回一个字符串类型的数组。它使用了条件类型和递归类型定义来实现。
 */
export type ToKeys<T> = T extends readonly [infer A, ...infer B] // 元组类型的解构赋值，将第一个元素赋值给变量A，将剩余元素赋值给变量B
  ? // 判断A是否包含key属性
    A extends {
      readonly key: infer K // 如果包含，则使用infer关键字提取key属性的类型，并将其赋值给变量K
    }
    ? B['length'] extends 0 // 如果B的长度为0，则返回一个只包含K的数组[K]
      ? [K]
      : [K, ...ToKeys<B>] // 否则递归处理剩余的元素B
    : never // 不包含，返回never类型
  : []

/**
 * 从一个包含value属性的元组类型中提取所有value属性的名称，并返回一个字符串类型的数组
 *
 * 它接受一个元组类型T，并返回一个字符串类型的数组。它使用了条件类型和递归类型定义来实现。
 */
export type ToValues<T> = T extends readonly [infer A, ...infer B]
  ? A extends {
      // 判断A是否包含value属性
      readonly value: infer K
    }
    ? B['length'] extends 0
      ? [K]
      : [K, ...ToValues<B>]
    : never
  : []
/**
 * 将一个包含key属性的对象类型转换为一个以key属性的值为键，以原对象为值的单个键值对对象类型
 *
 * {key: 'foo', value: 42}，则ToSingleKeyMap将返回一个对象类型{readonly foo: {key: 'foo', value: 42}}。
 */
type ToSingleKeyMap<T> = T extends {
  readonly key: infer K
}
  ? K extends PropertyKey
    ? {
        readonly [Key in K]: T
      }
    : never
  : never

/**
 * 将一个交叉类型A转换为一个普通对象类型
 *
 * { a: number } & { b: string }，则MergeIntersection将返回一个对象类型{ a: number, b: string }
 */
export type MergeIntersection<A> = A extends infer T ? { [Key in keyof T]: T[Key] } : never
/**
 * 将一个包含key属性的元组类型转换为一个以key属性的值为键，以原元组的对象为值的键值对对象类型
 */
export type ToKeyMap<T> = T extends readonly [infer A, ...infer B]
  ? B['length'] extends 0
    ? ToSingleKeyMap<A>
    : MergeIntersection<ToSingleKeyMap<A> & ToKeyMap<B>>
  : []

/**
 * 将一个包含value属性的对象类型转换为一个以value属性的值为键，以原对象为值的单个键值对对象类型
 *
 * {key: 'foo', value: 42}，则ToSingleValueMap将返回一个对象类型{readonly 42: {key: 'foo', value: 42}}。
 */
type ToSingleValueMap<T> = T extends {
  readonly value: infer K
}
  ? K extends PropertyKey
    ? {
        readonly [Key in K]: T
      }
    : never
  : never
/**
 * 将一个包含value属性的元组类型转换为一个以value属性的值为键，以原元组的对象为值的键值对对象类型
 */
export type ToValueMap<T> = T extends readonly [infer A, ...infer B]
  ? B['length'] extends 0
    ? ToSingleValueMap<A>
    : MergeIntersection<ToSingleValueMap<A> & ToValueMap<B>>
  : []

/**
 * 将一个包含 key 和 value 属性的对象类型转换为一个以 key 属性的值为键，以 value 属性的值为值的键值对对象类型
 */
type ToSingleKeyValue<T> = T extends {
  readonly key: infer K
  readonly value: infer V
}
  ? K extends PropertyKey
    ? {
        readonly [Key in K]: V
      }
    : never
  : never
// 多个
export type ToKeyValue<T> = T extends readonly [infer A, ...infer B]
  ? B['length'] extends 0
    ? ToSingleKeyValue<A>
    : MergeIntersection<ToSingleKeyValue<A> & ToKeyValue<B>>
  : []

/**
 * 将一个包含 key 和 value 属性的对象类型转换为一个以 value 属性的值为键，以 key 属性的值为值的键值对对象类型
 */
type ToSingleValueKey<T> = T extends {
  readonly key: infer K
  readonly value: infer V
}
  ? V extends PropertyKey
    ? {
        readonly [Key in V]: K
      }
    : never
  : never
// 多个
export type ToValueKey<T> = T extends readonly [infer A, ...infer B]
  ? B['length'] extends 0
    ? ToSingleValueKey<A>
    : MergeIntersection<ToSingleValueKey<A> & ToValueKey<B>>
  : []

function _defineConstants<T extends readonly IBaseDef[], N extends string>(defs: T, namespace?: N) {
  const prefix = namespace ? `${namespace}_` : ''
  return {
    [`${prefix}LIST`]: defs,
    [`${prefix}KV`]: defs.reduce(
      (map, item) => ({
        ...map,
        [item.key]: item.value,
      }),
      {}
    ),
  } as MergeIntersection<
    {
      [Key in ToProperty<'LIST', N>]: T
    } & {
      [Key in ToProperty<'KV', N>]: {
        [Key in ToProperty<'KV', N>]: ToKeyValue<T>
      }
    }
  >
}
