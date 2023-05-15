import type { MouseEvent, ReactNode } from 'react'
import React from 'react'
import './Button.less'

export interface ButtonProps {
  label?: string
  size?: 'large' | 'middle' | 'small'
  children?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
  // TODO 待补充属性 size -> 样式, disabled, ghost, type
  // TODO A11Y
}

export const Button = ({ onClick, label, children, size: _size }: ButtonProps) => {
  return <button onClick={(e) => onClick?.(e)}>{label || children}</button>
}
