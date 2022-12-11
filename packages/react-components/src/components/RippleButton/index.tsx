import React, { useCallback, MouseEvent, ReactNode, useContext } from 'react'
import { PREFIX_CLS } from '@/constant'
import { UIContext } from '../ConfigProvider'
import './style.less'

function createRipple(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) {
  const button = event.currentTarget
  const ripple = button.getElementsByClassName('ripple')[0]

  if (ripple) {
    ripple.remove()
  }

  // 点击的当前位置，创建一个元素，添加水波纹动画
  // dynamic inject
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`
  circle.classList.add('ripple')

  button.appendChild(circle)
}

interface Props {
  children?: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void
}
export const RippleButton = ({ children, onClick }: Props) => {
  const context = useContext(UIContext)
  const prefixCls = context.prefixCls || PREFIX_CLS
  const handleClick = useCallback((e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    onClick && onClick(e)
    createRipple(e)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button
      className={`${prefixCls}-btn btn`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}
