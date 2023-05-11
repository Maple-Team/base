import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

interface BaseProps {
  foldRenderer?: (open?: boolean) => ReactNode
  children?: ReactNode
  /**
   * 内容宽度
   */
  contentWidth?: number
  collapsed?: boolean
  drawerClassNames?: string
}
interface HorizontalProps extends BaseProps {
  bottomContent?: ReactNode
  bottomContentWrapperClassNames?: string
  topContent?: ReactNode
  topContentWrapperClassNames?: string
  /**
   * drawer方向
   */
  direction?: 'horizontal'
  /**
   * drawer收起方向
   */
  position?: 'left' | 'right'
}
interface verticalProps extends BaseProps {
  /**
   * drawer方向
   */
  direction?: 'vertical'
  /**
   * drawer收起方向
   */
  position?: 'top' | 'bottom'
}
/**
 * 联合类型应用 -> type narrow
 */
type Props = HorizontalProps | verticalProps
/**
 * Drawer
 * @param param0
 * @returns
 */
const Drawer = ({ foldRenderer, contentWidth, children, collapsed, drawerClassNames, ...rest }: Props) => {
  const [open, setOpen] = useState<boolean>(true)
  const onToggleOpen = useCallback(() => {
    setOpen((_) => !_)
  }, [])

  // 响应传入的属性值
  useEffect(() => {
    if (collapsed) setOpen(false)
    else setOpen(true)
  }, [collapsed])

  console.log(open, 'children')
  // TODO 补充事件
  const position = rest?.position

  const foldElement = useMemo(() => {
    if (foldRenderer) return foldRenderer(open)
    switch (position) {
      case 'left':
        return open ? '<' : '>'
      case 'right':
        return open ? '>' : '<'
      case 'top':
        return open ? 'v' : '^'
      case 'bottom':
        return open ? 'v' : '^'
      default:
        break
    }
  }, [open, foldRenderer, position])

  const horizontalDrawerClass = classNames(
    'absolute',
    'h-[calc(100%-16px)]',
    'transform',
    'will-change-transform',
    'ease-in',
    'duration-300',
    'my-2',
    rest.position === 'left' ? 'left-2' : 'right-2',
    open ? 'translate-x-0' : rest.position === 'left' ? '-translate-x-full' : 'translate-x-full',
    drawerClassNames ?? ''
  )

  if (rest?.direction === 'horizontal') {
    return (
      <div className={horizontalDrawerClass}>
        {/* 内容区域 */}
        <div className={`${contentWidth ? `w-[${contentWidth}px]` : ''} h-full rounded`}>{children}</div>
        {/* 折叠抓手  */}
        <div
          onClick={onToggleOpen}
          className={`absolute mt-20 top-0 w-5 bg-white h-20 flex flex-col justify-center items-center ${
            rest.position === 'left' ? 'rounded-r -right-5' : 'rounded-l -left-5'
          } cursor-pointer`}
        >
          {foldElement}
        </div>
        {rest?.topContent && (
          <div
            className={`absolute top-0 ${rest.position === 'left' ? 'right-0' : 'left-0'} ${
              rest?.topContentWrapperClassNames ?? ''
            }`}
          >
            {rest.topContent}
          </div>
        )}
        {rest?.bottomContent && (
          <div
            className={`absolute bottom-0 ${rest.position === 'left' ? 'right-0' : 'left-0'} ${
              rest?.bottomContentWrapperClassNames ?? ''
            }`}
          >
            {rest.bottomContent}
          </div>
        )}
      </div>
    )
  } else if (rest?.direction === 'vertical') {
    const verticalDrawerClass = classNames(
      'absolute',
      // 'h-[calc(100%-48px)]',
      'h-40',
      'transform',
      'will-change-transform',
      'ease-in',
      'duration-300',
      'right-0',
      rest.position === 'top' ? 'top-2' : 'bottom-2',
      open ? 'translate-y-0' : rest.position === 'top' ? '-translate-y-full' : 'translate-y-full',
      drawerClassNames ?? ''
    )
    return (
      <div className={verticalDrawerClass}>
        <div className={`${contentWidth ? `w-[${contentWidth}px]` : ''} h-full rounded`}>{children}</div>
        <div
          onClick={onToggleOpen}
          className={`absolute right-0 bg-white flex flex-col justify-center items-center ${
            rest.position === 'top' ? '-bottom-5' : '-top-5'
          } cursor-pointer`}
        >
          {foldElement}
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Drawer
