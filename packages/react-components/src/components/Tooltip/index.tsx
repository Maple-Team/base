import type { ReactNode } from 'react'
import React from 'react'
import './index.less'

// 样式输出到dist下面
export interface TooltipProps {
  /**
   * 内容
   */
  title: string
  children: ReactNode
  placement: 'left' | 'top' | 'right' | 'bottom'
}

export const Tooltip = ({ title, children, placement }: TooltipProps) => {
  return (
    <div className="tooltip-container">
      <div className={`tooltip-wrapper tooltip-wrapper-${placement}`}>{title}</div>
      {children}
    </div>
  )
}
