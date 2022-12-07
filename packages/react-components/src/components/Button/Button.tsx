import React, { ReactNode } from 'react'
import './Button.less'

export interface ButtonProps {
  label?: string
  size?: 'large' | 'middle' | 'small'
  children?: ReactNode
}

export const Button = (props: ButtonProps) => {
  return <button>{props.label || props.children}</button>
}
