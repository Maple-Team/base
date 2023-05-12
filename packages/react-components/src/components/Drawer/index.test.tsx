import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import type { DrawerProps } from './index'
import Drawer from './index'

describe('Drawer Component', () => {
  const renderDrawer = (props: DrawerProps) => {
    return render(<Drawer {...props} />)
  }
  // NOTE 渲染测试： 正常渲染、传入属性渲染达到预期
  it('should render right', () => {
    const { container } = renderDrawer({})
    expect(container.firstChild).toBeInTheDocument()
  })
  // NOTE 默认属性
  it('should render the component with default props', () => {
    const { container } = renderDrawer({})
    // Add your assertions here to verify the component's default rendering
    const foldElement = container.querySelector('.cursor-pointer')
    expect(foldElement).not.toBeNull()
    expect(foldElement).toHaveTextContent('<')

    // 验证默认属性是否被正确应用
    // TODO: 添加适当的断言验证默认属性
    // 验证子组件是否正确渲染
    // TODO: 添加适当的断言验证子组件渲染结果
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
    let container: HTMLElement
    beforeEach(() => {
      const res = renderDrawer(props)
      container = res.container
    })
    it('should content width be right number', () => {
      const contentEl = container.querySelector('.h-full')
      expect(contentEl).not.toBeNull()
      expect(contentEl).toHaveClass('w-[500px]')
    })
    it('should drawer has right wrapper class', () => {
      const wrapperEl = container.firstChild
      expect(wrapperEl).toHaveClass('custom-class')
    })
    it('should drawer has right content', () => {
      expect(container.querySelector('.content')).toHaveTextContent('Test content')
    })
    it('should drawer has right top content', () => {
      expect(container.querySelector('.top-wrapper')).toHaveTextContent('Top Content')
    })
    it('should drawer has right bottom content', () => {
      expect(container.querySelector('.bottom-wrapper')).toHaveTextContent('Bottom Content')
    })
    it('should fold element has right content', () => {
      const foldElement = container.querySelector('.cursor-pointer')
      expect(foldElement).toHaveTextContent('<')
    })
  })
  // 其余属性
  describe('should render the fold element with custom render props', () => {
    it('should render empty fold element with mock fn', () => {
      const { container } = renderDrawer({ foldRenderer: jest.fn() })
      expect(container.querySelector('.cursor-pointer')).toHaveTextContent('')
    })
    it('should render empty fold element with render', () => {
      const { container } = renderDrawer({
        foldRenderer: (open) => {
          return open ? <div>open</div> : <div>closed</div>
        },
      })
      expect(container.querySelector('.cursor-pointer')).toHaveTextContent('open')
    })
  })
  describe('should render', () => {
    it('1', () => {
      const render = renderDrawer({ collapsed: true })
      expect(render.container.querySelector('.cursor-pointer')).toHaveTextContent('>')
      // expect(render)
    })
    it('2', () => {})
  })
  // NOTE 交互测试
  it('should toggle open state when fold element is clicked', () => {
    const { container } = renderDrawer({
      foldRenderer(open) {
        return <div className="fold-element">{open ? '<' : '>'}</div>
      },
    })
    const foldElement = container.querySelector('.fold-element')
    expect(foldElement).not.toBeNull()
    expect(foldElement!).toHaveTextContent('<')

    fireEvent.click(foldElement!)
    // 验证组件的开关状态是否正确切换
    // TODO: 添加适当的断言验证开关状态切换
    // 验证相应的事件处理函数是否被调用
    // TODO: 添加适当的断言验证事件处理函数调用

    // Add your assertions here to verify the open state has changed
  })
  // NOTE 事件测试, 组件抛出的事件
})
