import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Root } from './types'

export const baseURL = 'https://randomuser.me'
export const axiosInstance = axios.create({
  timeout: 5 * 60 * 1000,
})
axiosInstance.defaults.baseURL = baseURL

const fetchApiInfo = (): Promise<Root> => axiosInstance.get('/api').then((res) => res.data)

export function useCustomHook() {
  return useQuery(['customHook'], fetchApiInfo)
}
