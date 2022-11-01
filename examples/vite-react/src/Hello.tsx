import { PureComponent, ReactNode } from 'react'
import { Props, withWindowSize } from './withWindowSize'

class Hello extends PureComponent<Props> {
  render(): ReactNode {
    const { windowSize, name } = this.props

    return (
      <>
        <div>Hello {name}!</div>
        <div>windowSize: {JSON.stringify(windowSize)}</div>
      </>
    )
  }
}

export default withWindowSize(Hello)
