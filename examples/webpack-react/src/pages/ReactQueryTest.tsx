import https from 'node:https'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
// import { sleep } from '@liutsing/utils'
import axios from 'axios'
import type { Root } from './type'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

const fetchApiInfo = async (): Promise<Root> =>
  axios
    .get('https://randomuser.me/api', {
      httpsAgent: agent,
    })
    .then((res) => res.data)

export function useCustomHook() {
  return useQuery({ queryKey: ['customHook'], queryFn: fetchApiInfo })
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
