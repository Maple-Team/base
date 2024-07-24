import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const fetchData = async () => {
  // 模拟异步请求
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { message: 'Hello, React Query!' }
}

const Example5 = () => {
  const queryClient = useQueryClient()
  // @ts-expect-error: 忽略不处理
  const { data, isLoading } = useQuery(['exampleQueryKey'], fetchData)

  const handleUpdateData = () => {
    const newData = { message: 'Updated Data!' }
    queryClient.setQueryData(['exampleQueryKey'], newData)
  }

  return (
    <div>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          <p>
            {
              // @ts-expect-error: 忽略不处理
              data?.message
            }
          </p>
          <button onClick={handleUpdateData}>Update Data</button>
        </div>
      )}
    </div>
  )
}

export default Example5
