import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axios } from '@/http'

const fetchData = async () => {
  // 模拟异步请求
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { message: 'Hello, React Query!' }
}

const fetchLzzData = async () => {
  // 模拟异步请求
  return await Promise.all([
    axios.get('http://localhost:4003/api/lzz/pages'),
    axios.get('http://localhost:4003/api/lzz/test'),
  ])
}

const Example5 = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['exampleQueryKey'],
    queryFn: fetchData,
  })
  const { data: lzzData, isLoading: lzzLoading } = useQuery({
    queryKey: ['lzzQueryKey'],
    queryFn: fetchLzzData,
  })

  console.log('lzzData', lzzData, lzzLoading)

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
          <p>{data?.message}</p>
          <button onClick={handleUpdateData}>Update Data</button>
        </div>
      )}
    </div>
  )
}

export default Example5
