import React, { CSSProperties } from 'react'

interface IconProps {
  /**
   * icon文件名
   */
  name: string
  /**
   * 样式名
   */
  className?: string
  /**
   * svg 图标的颜色
   */
  currentColor?: string
  /**
   * 点击事件
   */
  onClick?: () => void
  style?: CSSProperties
}

/**
 * Icon包裹类
 * @param param0
 * @returns
 */
export const Icon = ({ name, className, currentColor, onClick, style }: IconProps) => {
  return (
    <svg
      className={`${className} align-middle`}
      onClick={onClick}
      fill={currentColor}
      style={style}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  )
}
/**
 * 关闭Icon
 * @param param0
 * @returns
 */
export const IconClose = ({ onClick, className }: { className?: string; onClick?: () => void }) => (
  <Icon
    name="icon-close"
    className={`w-[24px] h-[24px] cursor-pointer ${className}`}
    onClick={onClick}
  />
)
