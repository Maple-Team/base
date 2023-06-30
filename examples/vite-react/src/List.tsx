import React from 'react'
export interface Props<T> {
  data: T[]
  renderItem: (item: T, index: number, data: T[]) => JSX.Element
  max: number
}
export const ListWithMore = <T,>({ data, renderItem, max }: Props<T>) => {
  const elements = data.map((item, index) => renderItem(item, index, data))
  const show = elements.slice(0, max)
  const hide = elements.slice(max)
  return (
    <div className="relative group">
      <ul>{show}</ul>
      <span className="">更多</span>
      <div className="absolute hidden group-hover:block">{hide.length > 0 && <ul>{hide}</ul>}</div>
    </div>
  )
}
