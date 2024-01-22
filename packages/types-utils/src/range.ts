// @https://github.com/type-challenges/type-challenges/issues/6111
export type InclusiveRange<
  Lower extends number,
  Higher extends number,
  C extends unknown[] = [],
  I = false,
  R extends number[] = []
> = I extends true
  ? C['length'] extends Higher
    ? [...R, Higher]
    : InclusiveRange<Lower, Higher, [...C, 1], true, [...R, C['length']]>
  : C['length'] extends Lower
  ? InclusiveRange<Lower, Higher, C, true>
  : C['length'] extends Higher
  ? []
  : InclusiveRange<Lower, Higher, [...C, 1], false>

// @https://github.com/type-challenges/type-challenges/issues/9988
export type Utils<L, C extends unknown[] = [], R = L> = C['length'] extends L ? R : Utils<L, [...C, 0], C['length'] | R>
export type NumberRange<L, H> = L | Exclude<Utils<H>, Utils<L>>

/**
 * 小于10的前面补0
 */
export type PadZero<N extends number> = N extends infer D extends NumberRange<0, 9> ? `0${D}` : N

/**
 * 字符range
 */
export type StringRange = `C${PadZero<InclusiveRange<1, 38>[number]>}`
