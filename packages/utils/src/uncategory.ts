/**
 * 等待函数
 * @param timeout ms
 * @returns
 */
export const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))
