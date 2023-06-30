import axios, { AxiosRequestConfig } from 'axios'
/**
 * 统一请求入口
 * @param config
 * @returns
 */
export const request = async <T = AnyToFix>(config: AxiosRequestConfig): Promise<T> => {
  try {
    // FIXME axios静态或实例
    const res = axios.request({ method: 'GET', ...config })
    return res as unknown as T
  } catch (error) {
    return Promise.reject(error)
  }
}
