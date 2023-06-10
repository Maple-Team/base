export const padStart = (arg: number | string, length: number, fill: string | number) =>
  `${arg}`.padStart(length, `${fill}`)

export const padEnd = (arg: number | string, length: number, fill: string | number) =>
  `${arg}`.padEnd(length, `${fill}`)

export const padStartDouble = (arg: number | string) => padStart(arg, 2, 0)
export const padEndDouble = (arg: number | string) => padEnd(arg, 2, 0)

/**
 * 延迟等待
 * @param delay
 * @returns
 */
export const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
