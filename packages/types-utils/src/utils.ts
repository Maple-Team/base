export type Ran<T extends number> = number extends T ? number : _Range<T, []>
type _Range<T extends number, R extends unknown[]> = R['length'] extends T ? R[number] : _Range<T, [R['length'], ...R]>
// FIXME Type instantiation is excessively deep and possibly infinite.
// export type ColorValue = Ran<256>

export type CreateArrayWithLengthX<LENGTH extends number, ACC extends unknown[] = []> = ACC['length'] extends LENGTH
  ? ACC
  : CreateArrayWithLengthX<LENGTH, [...ACC, 1]>

export type NumericRange<
  START_ARR extends number[],
  END extends number,
  ACC extends number = never
> = START_ARR['length'] extends END ? ACC | END : NumericRange<[...START_ARR, 1], END, ACC | START_ARR['length']>

// FIXME Type instantiation is excessively deep and possibly infinite.
// export type TWENTY_TO_FORTY = NumericRange<CreateArrayWithLengthX<0>, 256>

export type OptionalPick<T, U extends keyof T> = {
  [P in U]?: T[P]
}
