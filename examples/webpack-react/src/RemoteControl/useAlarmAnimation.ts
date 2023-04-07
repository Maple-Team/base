import { useInterval } from 'ahooks'
import { useState } from 'react'

export const useIconAnimation = (checked?: boolean) => {
  const [onNum, setOnNum] = useState<number>(0)

  useInterval(() => {
    if (checked) setOnNum((_) => _ + 1)
  }, 600)

  return onNum
}
