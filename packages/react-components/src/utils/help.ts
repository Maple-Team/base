import { assignWith } from 'lodash-es'
import type { ReactElement } from 'react'
import React from 'react'

export function mergeProps<A, B>(a: A, b: B): B & A
export function mergeProps<A, B, C>(a: A, b: B, c: C): C & B & A
export function mergeProps(...items: AnyToFix[]) {
  function customizer(objValue: AnyToFix, srcValue: AnyToFix) {
    return srcValue === undefined ? objValue : srcValue
  }

  let ret = { ...items[0] }
  for (let i = 1; i < items.length; i++) ret = assignWith(ret, items[i], customizer)

  return ret
}
export type PropagationEvent = 'click'

const eventToPropRecord: Record<PropagationEvent, string> = {
  click: 'onClick',
}
/**
 * 将组件的点击事件注入阻止冒泡的功能
 * @param events
 * @param element
 * @returns
 */
export function withStopPropagation(events: PropagationEvent[], element: ReactElement) {
  const props: Record<string, AnyToFix> = { ...element.props }
  for (const key of events) {
    const prop = eventToPropRecord[key]
    props[prop] = function (e: Event) {
      e.stopPropagation()
      element.props[prop]?.(e)
    }
  }
  return React.cloneElement(element, props)
}
