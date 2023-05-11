import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

interface Props {
  foldRenderer?: (open?: boolean) => ReactNode
  children?: ReactNode
  /**
   * 内容宽度
   */
  contentWidth?: number
  collapsed?: boolean
  drawerClassNames?: string
  bottomContent?: ReactNode
  bottomContentWrapperClassNames?: string
  topContent?: ReactNode
  topContentWrapperClassNames?: string
  /**
   * drawer收起方向
   */
  position?: 'left' | 'right'
}

/**
 * Drawer
 * @param param0
 * @returns
 */
const Drawer = ({
  foldRenderer,
  contentWidth,
  children,
  collapsed,
  drawerClassNames,
  position,
  topContentWrapperClassNames,
  topContent,
  bottomContent,
  bottomContentWrapperClassNames,
}: Props) => {
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

  const foldElement = useMemo(() => {
    if (foldRenderer) return foldRenderer(open)
    switch (position) {
      case 'left':
        return open ? '<' : '>'
      case 'right':
        return open ? '>' : '<'
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
    position === 'left' ? 'left-2' : 'right-2',
    open ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full',
    drawerClassNames ?? ''
  )

  return (
    <div className={horizontalDrawerClass}>
      {/* 内容区域 */}
      <div className={`${contentWidth ? `w-[${contentWidth}px]` : ''} h-full rounded`}>{children}</div>
      {/* 折叠抓手  */}
      <div
        onClick={onToggleOpen}
        className={`absolute mt-20 top-0 w-5 bg-white h-20 flex flex-col justify-center items-center ${
          position === 'left' ? 'rounded-r -right-5' : 'rounded-l -left-5'
        } cursor-pointer`}
      >
        {foldElement}
      </div>
      {topContent && (
        <div
          className={`absolute top-0 ${position === 'left' ? 'right-0' : 'left-0'} ${
            topContentWrapperClassNames ?? ''
          }`}
        >
          {topContent}
        </div>
      )}
      {bottomContent && (
        <div
          className={`absolute bottom-0 ${position === 'left' ? 'right-0' : 'left-0'} ${
            bottomContentWrapperClassNames ?? ''
          }`}
        >
          {bottomContent}
        </div>
      )}
    </div>
  )
}

export default Drawer
