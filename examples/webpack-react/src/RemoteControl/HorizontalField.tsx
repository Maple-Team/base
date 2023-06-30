import type { ReactNode } from 'react'
import React from 'react'

interface Props<T> {
  label: ReactNode
  value?: T
  children: ({ value }: { value?: T }) => JSX.Element
  bottomLine?: 'dashed' | 'solid'
}
// NOTE TAILWIND HACK border-dashed border-solid
// eslint-disable-next-line @typescript-eslint/comma-dangle
export const HorizontalField = <T,>({ label, children, value, bottomLine = 'dashed' }: Props<T>) => {
  return (
    <div
      className={`flex justify-between items-center py-[10px] border-0 border-b-[1px] border-${bottomLine} border-b-[rgba(0,0,0,0.15)]`}
    >
      <span>{label}</span>
      <div className="pr-4">{children({ value })}</div>
    </div>
  )
}
