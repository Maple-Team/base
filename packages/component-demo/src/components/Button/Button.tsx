import React from 'react'
import './Button.less'

export interface ButtonProps {
  label: string
  size?: 'large' | 'middle' | 'small'
}

const Button = (props: ButtonProps) => {
  return <button>{props.label}</button>
}

export default Button
