import type { ReactNode } from 'react'
import React, { createContext } from 'react'
import { PREFIX_CLS } from '@/constant'

interface ConfigProviderProps {
  children: ReactNode
  prefixCls?: string
}
type ContextField = 'prefixCls'

// 上下文值提供默认，也可接收外置传过来的值
const contextValue: Record<ContextField, string> = {
  prefixCls: PREFIX_CLS,
}
// ant-design源码 @https://github.com/ant-design/ant-design/blob/master/components/config-provider/context.tsx
// @https://github.com/ant-design/ant-design/blob/master/components/config-provider/index.tsx
// @https://ant.design/components/config-provider-cn#faq
export const UIContext = createContext(contextValue)

export const ConfigProvider = ({ children, prefixCls }: ConfigProviderProps) => {
  const _contentValue: Record<ContextField, string> = { ...contextValue }
  if (prefixCls) _contentValue.prefixCls = prefixCls

  return <UIContext.Provider value={_contentValue}>{children}</UIContext.Provider>
}
