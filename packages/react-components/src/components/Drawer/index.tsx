import type { ReactNode } from 'react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'

export interface DrawerProps {
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
 * @param DrawerProps props
 * @returns
 */
const Drawer = ({
  foldRenderer,
  contentWidth,
  children,
  collapsed,
  drawerClassNames,
  position = 'left',
  topContentWrapperClassNames,
  topContent,
  bottomContent,
  bottomContentWrapperClassNames,
}: DrawerProps) => {
  const [open, setOpen] = useState<boolean>(true)
  const onToggleOpen = useCallback(() => {
    setOpen((_) => !_)
  }, [])

  // NOTE 响应传入的属性值
  useEffect(() => {
    if (collapsed) setOpen(false)
    else setOpen(true)
  }, [collapsed])

  // TODO 补充事件

  const foldElement = useMemo(() => {
    if (foldRenderer) return foldRenderer(open)
    switch (position) {
      case 'right':
        return open ? '>' : '<'
      case 'left':
      default:
        return open ? '<' : '>'
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
    <div
      className={horizontalDrawerClass}
      data-testid="drawerWrap"
    >
      {/* 内容区域 */}
      <div
        className={`${contentWidth ? `w-[${contentWidth}px]` : ''} h-full rounded`}
        data-testid="drawerContentWrap"
      >
        {children}
      </div>
      {/* 折叠抓手  */}
      <div
        onClick={onToggleOpen}
        className={`absolute mt-20 top-0 w-5 bg-white h-20 flex flex-col justify-center items-center ${
          position === 'left' ? 'rounded-r -right-5' : 'rounded-l -left-5'
        } cursor-pointer`}
        data-testid="foldElWrap"
      >
        {foldElement}
      </div>
      {topContent && (
        <div
          className={`absolute top-0 ${position === 'left' ? 'right-0' : 'left-0'} ${
            topContentWrapperClassNames ?? ''
          }`}
          data-testid="topContentWrap"
        >
          {topContent}
        </div>
      )}
      {bottomContent && (
        <div
          className={`absolute bottom-0 ${position === 'left' ? 'right-0' : 'left-0'} ${
            bottomContentWrapperClassNames ?? ''
          }`}
          data-testid="bottomContentWrap"
        >
          {bottomContent}
        </div>
      )}
    </div>
  )
}

export default Drawer
