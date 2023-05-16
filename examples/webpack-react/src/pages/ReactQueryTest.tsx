import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
// import { sleep } from '@liutsing/utils'
import axios from 'axios'
import { Root } from './type'

const fetchApiInfo = async (): Promise<any> => {
  // return axios.get('/api', { baseURL: 'https://randomuser.me' }).then((res) => res.data)
  // return Promise.resolve(123)
  return axios.get('https://randomuser.me/api').then((res) => res.data)
  // await sleep(10 * 1000)
  // return axios.get('https://randomuser.me/api').then((res) => 123)
}

export function useCustomHook() {
  return useQuery({ queryKey: ['customHook'], queryFn: fetchApiInfo })
}

export const useFetchInfo = () => {
  const [info, setInfo] = useState<Root>()
  const { data, isSuccess } = useCustomHook()
  useEffect(() => {
    if (isSuccess) {
      setInfo(data)
    }
  }, [isSuccess, data])
  return info
}
export default () => {
  const info = useFetchInfo()
  return <div>{JSON.stringify(info)}</div>
}
