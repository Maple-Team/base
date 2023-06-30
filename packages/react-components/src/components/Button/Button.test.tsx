import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  test('Button component should render right', () => {
    render(<Button label="Hello world!" />)
    const button = screen.getByText('Hello world!')
    expect(button).toHaveTextContent('Hello world!')
  })
  test('Button component should render right with children', () => {
    render(<Button>button</Button>)
    const button = screen.getByText('button')
    expect(button).toHaveTextContent('button')
  })

  it('Button component should be called onclick callback function', async () => {
    const user = userEvent.setup()
    const fn = jest.fn()
    render(<Button label="Hello world!" onClick={fn} />)
    const button = screen.getByText('Hello world!')
    await user.click(button)
    expect(fn).toHaveBeenCalled()
    await user.click(button)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
// 在测试用例中，您可以使用 `toHaveClass` 方法来测试按钮元素是否具有正确的类名。例如，在这个测试集中，您可以使用 `toHaveClass` 方法来测试按钮元素是否具有正确的 `button` 类名。
// 您可以增加更多的测试用例来覆盖更多的代码路径和边界情况。例如，您可以测试按钮的禁用状态、悬停状态、焦点状态等。
