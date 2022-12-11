import React, { ReactNode, MouseEvent } from 'react'
import './Button.less'

export interface ButtonProps {
  label?: string
  size?: 'large' | 'middle' | 'small'
  children?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
}

export const Button = (props: ButtonProps) => {
  return <button onClick={(e) => props.onClick && props.onClick(e)}>{props.label || props.children}</button>
}
