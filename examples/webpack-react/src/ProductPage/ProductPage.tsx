import React, { ReactNode, useEffect } from 'react'

export default ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // @ts-ignore
    import('lodash-es/add').then((fn: (...args: unknown[]) => unknown) => {
      const res = fn(1 + 2)
      console.log(res)
    })
  }, [])
  return <div>product page {children}</div>
}
