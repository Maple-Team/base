import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import type { Root } from './type'

export const baseURL = 'https://randomuser.me'
export const axiosInstance = axios.create({
  baseURL,
  timeout: 5 * 60 * 1000,
})
axiosInstance.defaults.baseURL = baseURL

export const fetchApiInfo = (): Promise<Root> => axiosInstance.get('/api').then((res) => res.data)

export function useCustomHook() {
  return useQuery(['customHook', { t: dayjs().valueOf() }], fetchApiInfo)
}

export const useFetchInfo = () => {
  const [info, setInfo] = useState<Root>()
  const { data, isSuccess } = useCustomHook()
  useEffect(() => {
    if (isSuccess) setInfo(data)
  }, [isSuccess, data])
  return info
}
export default () => {
  const info = useFetchInfo()
  return <div>{JSON.stringify(info)}</div>
}
