import type { ReactNode } from 'react'
import React from 'react'
import { renderImperatively } from '@/utils'

export type MessageLevel = 'info' | 'success' | 'error'

export const Message = ({ content, level }: { content: string | ReactNode; level: MessageLevel }) => {
  return (
    <div>
      <i>{level}</i>
      <div>{content}</div>
    </div>
  )
}

const show = (content: string | ReactNode, level: MessageLevel) => {
  const node = renderImperatively(<Message level={level} content={content} />)
  return node
}

export const info = (content: string | ReactNode) => show(content, 'info')
export const success = (content: string | ReactNode) => show(content, 'success')
export const error = (content: string | ReactNode) => show(content, 'error')
