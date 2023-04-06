import React, { ReactNode, useEffect } from 'react'

export default ({ children, a }: { a?: number; children: ReactNode }) => {
  useEffect(() => {
    // @ts-ignore
    import('lodash-es/add').then((fn: (...args: unknown[]) => unknown) => {
      const res = fn(1 + 2)
      console.log(res)
    })
  }, [a])
  return <div>product page {children}</div>
}
