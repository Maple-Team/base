import { useEffect, useState } from 'react'
export interface Size {
  width: number
  height: number
}

export const useWindowSize = () => {
  const getSize = (): Size => ({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const [size, setSize] = useState<Size>(getSize())
  useEffect(() => {
    const handler = () => {
      setSize(getSize())
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return size
}
