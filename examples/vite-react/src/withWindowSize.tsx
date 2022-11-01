import React from 'react'
import { type Size, useWindowSize } from '@liutsing/rc-hooks'

export type Props = {
  name: string
  windowSize?: Size
}
export const withWindowSize = (Component: React.JSXElementConstructor<Props>) => {
  return (props: Props) => {
    const windowSize = useWindowSize()
    return (
      <Component
        windowSize={windowSize}
        {...props}
      />
    )
  }
}
