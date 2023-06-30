import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { Root } from './types'

export const fetchApiInfo = (): Promise<Root> => axios.get('https://randomuser.me/api').then((res) => res.data)

export function useCustomHook() {
  return useQuery(['customHook'], fetchApiInfo)
}
