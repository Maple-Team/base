import React from 'react'
import Drawer, {DrawerProps} from './index'
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent(content: string | RegExp): R;
      toBeInTheDocument():R
      toHaveClass(className: string): R
    }
  }
}

// 在进行组件的单元测试时，通常可以按照以下套路进行：

// 1. 渲染测试（Render Testing）：确保组件能够正确地渲染，并验证组件是否在DOM中正确显示。

// 2. 交互测试（Interaction Testing）：模拟用户与组件的交互行为，例如点击按钮、输入文本等，然后验证组件是否正确响应这些交互。

// 3. 状态测试（State Testing）：测试组件在不同状态下的行为，包括初始化状态、状态改变等。

// 4. 事件测试（Event Testing）：测试组件中的事件处理函数是否被正确地触发，并验证事件处理的结果是否符合预期。

// 5. 异步测试（Async Testing）：如果组件涉及异步操作（例如异步数据加载），需要测试异步操作的正确性，包括成功加载、加载失败等情况。

// 6. 边界测试（Boundary Testing）：针对组件的边界情况进行测试，包括传入边界值、极端情况等，以确保组件能够处理这些情况并保持正确的行为。

// 7. 快照测试（Snapshot Testing）：捕捉组件的渲染结果，并将其与之前的快照进行比较，以确保组件的渲染输出没有意外变化。

// 以上是常见的组件单元测试套路，你可以根据具体情况选择适合你的组件的测试策略。同时，你也可以使用 `@testing-library/react` 提供的工具和断言方法来简化测试的编写和断言的验证过程。

// 记住，单元测试的目的是验证组件的行为是否符合预期，并为代码的维护和重构提供信心和保障。因此，尽量覆盖组件的各种情况和代码路径，以确保组件的质量和稳定性。
describe('Drawer Component', () => {
  const renderDrawer = (props: DrawerProps) => {
    return render(<Drawer {...props} />)
  }

  it('should render the component with default props', () => {
    const { container } = renderDrawer({})
    // Add your assertions here to verify the component's default rendering
    const foldElement = container.querySelector('.cursor-pointer')
    expect(foldElement).not.toBeNull()
    expect(foldElement).toHaveTextContent('<')
    expect(container.firstChild).toBeInTheDocument();
      // 验证默认属性是否被正确应用
    // TODO: 添加适当的断言验证默认属性
    // 验证子组件是否正确渲染
    // TODO: 添加适当的断言验证子组件渲染结果
  })

  it('should toggle open state when fold element is clicked', () => {
    const { container } = renderDrawer({
      foldRenderer(open) {
        return <div className='fold-element'>{open ? '<' : '>'}</div>
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

  it('should have correct initial state', () => {
    const { container } = render(<Drawer />);
    // 测试组件的 open 状态初始值是否为 true
    expect(container.firstChild).toHaveClass('open-true');
  });

  it('should render the component with custom props', () => {
    const props: DrawerProps = {
      foldRenderer: jest.fn(),
      contentWidth: 500,
      children: <div>Test Children</div>,
      collapsed: true,
      drawerClassNames: 'custom-class',
      position: 'left',
      topContentWrapperClassNames: 'top-wrapper',
      topContent: <div>Top Content</div>,
      bottomContent: <div>Bottom Content</div>,
      bottomContentWrapperClassNames: 'bottom-wrapper',
    }

    const { container } = renderDrawer(props)

    // Add your assertions here to verify the component is rendered correctly with the custom props
  })
})
