import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import type { DrawerProps } from './index'
import Drawer from './index'

describe('Drawer Component', () => {
  const renderDrawer = (props: DrawerProps) => {
    return render(<Drawer {...props} />)
  }
  // NOTE 渲染测试：默认属性
  it('should render the component with default props', () => {
    // Add your assertions here to verify the component's default rendering
    renderDrawer({})
    const foldElement = screen.getByTestId('foldElWrap')
    expect(foldElement).toHaveTextContent('<')
    expect(foldElement).toHaveClass('rounded-r', '-right-5')
    const drawerWrapEl = screen.getByTestId('drawerWrap')
    expect(drawerWrapEl).toHaveClass('translate-x-0')
    const drawerContentWrapEl = screen.getByTestId('drawerContentWrap')
    expect(drawerContentWrapEl).toHaveClass('h-full', 'rounded')

    const topContentWrapEl = screen.queryByTestId('topContentWrap')
    expect(topContentWrapEl).toBeNull()
    const bottomContentWrapEl = screen.queryByTestId('bottomContentWrap')
    expect(bottomContentWrapEl).toBeNull()
  })

  // NOTE 自定义属性
  describe('should render the component with custom props', () => {
    const props: DrawerProps = {
      contentWidth: 500,
      children: <div className="content">Test content</div>,
      drawerClassNames: 'custom-class',
      position: 'left',
      topContentWrapperClassNames: 'top-wrapper',
      topContent: <div>Top Content</div>,
      bottomContent: <div>Bottom Content</div>,
      bottomContentWrapperClassNames: 'bottom-wrapper',
    }
    beforeEach(() => {
      renderDrawer(props)
    })
    it('should content width be right number', () => {
      const drawerContentWrapEl = screen.getByTestId('drawerContentWrap')
      expect(drawerContentWrapEl).toHaveClass('w-[500px]')
    })
    it('should drawer has right wrapper class', () => {
      const drawerWrapEl = screen.getByTestId('drawerWrap')
      expect(drawerWrapEl).toHaveClass('custom-class', 'translate-x-0')
    })
    it('should drawer has right content', () => {
      const drawerContentWrapEl = screen.getByTestId('drawerContentWrap')
      expect(drawerContentWrapEl).toHaveTextContent('Test content')
    })
    it('should drawer has right top content', () => {
      const topContentWrapEl = screen.getByTestId('topContentWrap')

      expect(topContentWrapEl).toHaveClass('right-0', 'top-wrapper')
      expect(topContentWrapEl).toHaveTextContent('Top Content')
    })
    it('should drawer has right bottom content', () => {
      const bottomContentWrapEl = screen.getByTestId('bottomContentWrap')

      expect(bottomContentWrapEl).toHaveClass('right-0', 'bottom-wrapper')
      expect(bottomContentWrapEl).toHaveTextContent('Bottom Content')
    })
    it('should fold element has right content', () => {
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).not.toBeNull()
      expect(foldWrapEl).toHaveTextContent('<')
      expect(foldWrapEl).toHaveClass('cursor-pointer')
    })
  })
  // 其余属性
  describe('should render the fold element with custom render props', () => {
    it('should render empty fold element with mock fn', () => {
      renderDrawer({ foldRenderer: jest.fn() })
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).toHaveTextContent('')
    })
    it('should render empty fold element with render', () => {
      renderDrawer({
        foldRenderer: (open) => {
          return open ? <div>open</div> : <div>closed</div>
        },
      })
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).toHaveTextContent('open')
    })
    it('should render right fold element when position is right', () => {
      renderDrawer({
        position: 'right',
      })
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).toHaveTextContent('>')
      expect(foldWrapEl).toHaveClass('rounded-l', '-left-5')
    })
    it('should render right fold element when collapsed is true', () => {
      renderDrawer({
        collapsed: true,
      })
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).toHaveTextContent('>')
      const drawerWrapEl = screen.getByTestId('drawerWrap')
      expect(drawerWrapEl).toHaveClass('-translate-x-full')
    })
    it('should render right fold element when collapsed is true and position is right', () => {
      renderDrawer({
        position: 'right',
        collapsed: true,
      })
      const foldWrapEl = screen.getByTestId('foldElWrap')
      expect(foldWrapEl).toHaveTextContent('<')
      const drawerWrapEl = screen.getByTestId('drawerWrap')
      expect(drawerWrapEl).toHaveClass('translate-x-full')
    })
  })
  // NOTE 交互测试
  it('should toggle open state when fold element is clicked', () => {
    renderDrawer({})
    // 初始状态
    const foldWrapEl = screen.getByTestId('foldElWrap')
    expect(foldWrapEl).toHaveTextContent('<')
    const drawerWrapEl = screen.getByTestId('drawerWrap')
    expect(drawerWrapEl).toHaveClass('translate-x-0')

    // 第一次点击了折叠，drawer class改变
    fireEvent.click(foldWrapEl)
    expect(drawerWrapEl).toHaveClass('-translate-x-full')
    expect(drawerWrapEl).not.toHaveClass('translate-x-0')
    expect(foldWrapEl).toHaveTextContent('>')

    // 第二次点击了折叠，drawer class恢复
    fireEvent.click(foldWrapEl)
    expect(drawerWrapEl).toHaveClass('translate-x-0')
    expect(drawerWrapEl).not.toHaveClass('-translate-x-full')
    expect(foldWrapEl).toHaveTextContent('<')
  })
  // NOTE 事件测试, 组件抛出的事件
})
