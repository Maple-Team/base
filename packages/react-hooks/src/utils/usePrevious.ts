import { useRef } from 'react'

export type ShouldUpdateFunc<T> = (a: T | undefined, b: T) => boolean
/**
 * 它用于跟踪并存储在不同渲染周期中的值。其核心功能是允许你比较当前渲染周期中的值与上一个渲染周期中的值。
 * 这在需要基于值的变化来执行逻辑时非常有用，但又不想直接使用 React 的 useState 或 useReducer 来触发组件的重新渲染。
 * 1. 跟踪上一个渲染周期的值：usePrevious 可以存储任何值，包括基本类型和对象引用，并在组件的下一个渲染周期中提供访问。
 * 2. 比较值的变化：你可以使用 usePrevious 来检查一个值是否已经改变，从而决定是否执行某些操作。
 * 3. 优化性能：通过检查值的变化，可以避免不必要的操作或副作用，从而提高组件的性能。
 * 4. 条件渲染：根据值的变化来决定是否渲染特定的组件或元素。
 * 5. 同步状态：在某些复杂的状态逻辑中，usePrevious 可以用来同步或协调不同状态变量的值。
 * 双指针法✨✨✨
 * @param arg
 * @returns
 */
export const usePrevious = <T>(
  state: T,
  shouldUpdateFunc: ShouldUpdateFunc<T> = (a?: T, b?: T) => !Object.is(a, b)
) => {
  const prevRef = useRef<T | undefined>()
  const curRef = useRef<T | undefined>()

  if (shouldUpdateFunc(curRef.current, state)) {
    prevRef.current = curRef.current
    curRef.current = state
  }

  return prevRef.current
}
