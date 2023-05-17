import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import { rest } from 'msw'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import mockData from '@/mockData.json'

export const handlers = [
  rest.get('*/react-query', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'mocked-react-query',
      })
    )
  }),
  rest.get('*/api', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockData))
  }),
]

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // 测试react-query首先我们必须得拥有queryClient，所以我们初始化queryClient，
        // 因为默认是重试三次，这意味着如果想测试错误的查询，测试可能会超时。所以可以在初始化时关闭
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  })

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient()
  const { rerender, ...result } = render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>)
  const renderResult: RenderResult = {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(<QueryClientProvider client={testQueryClient}>{rerenderUi}</QueryClientProvider>),
  }
  return renderResult
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  )
}
