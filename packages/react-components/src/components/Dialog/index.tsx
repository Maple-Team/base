import React from 'react'
import { renderImperatively } from '@/utils'

export const show = (key?: string) => {
  const handler = renderImperatively(<div key={key || 'key'}>123</div>)
  return handler
}
