import type { ReactNode } from 'react'
import React from 'react'
// import styles from './index.less'
import './index.less'
// 样式输出到dist下面
export interface TooltipProps {
  /**
   * 内容
   */
  title: string
  children: ReactNode

  // 位置 placement: 'left'|'top'|'right'|'bottom'
}

export const Tooltip = ({ title, children }: TooltipProps) => {
  return (
    <div className="tooltip-container">
      <div className="tooltip-wrapper">{title}</div>
      {children}
    </div>
  )
}
