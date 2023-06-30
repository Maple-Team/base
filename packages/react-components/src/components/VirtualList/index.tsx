import React, { ReactNode } from 'react'
export interface VirtualListProps<T> {
  /**
   * 数据源
   */
  data: T[]
  /**
   * 每项如何展示数据
   * @param item
   * @returns
   */
  renderItem: (item: T) => ReactNode
  /**
   * 每次展示的数据条目
   */
  renderNum: number
}

export const VirtualList = () => {
  return (
    <div>
      <div className="content">{}</div>
      <div className="scrollbar">
        <div className="scrollbar-track" />
        <div className="scrollbar-thumb" />
      </div>
    </div>
  )
}
