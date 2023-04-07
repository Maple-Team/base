import type { ReactNode } from 'react'
import React, { useEffect } from 'react'

export default ({ children, a }: { a?: number; children: ReactNode }) => {
  useEffect(() => {
    import('lodash-es/add')
      .then((fn: AnyToFix) => {
        const res = fn(1 + 2)
        console.log(res)
      })
      .catch(console.log)
  }, [a])
  return <div>product page {children}</div>
}
