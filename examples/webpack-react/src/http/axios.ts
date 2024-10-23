import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'

declare module 'axios' {
  /**
   * NOTE 拓展axios请求字段
   */
  interface AxiosRequestConfig {
    /**
     * 是否为外部请求
     */
    isExternalReq?: boolean
    /**
     * 是否为上传请求
     */
    isUploadReq?: boolean
    /**
     * 是否为下载请求
     */
    isDownloadReq?: boolean
    /**
     * 是否有前缀
     */
    noPrefix?: boolean
    /**
     * 是否为刷新请求
     */
    isRefreshToken?: boolean
    /**
     * 已重试次数(内部)
     */
    _retryCount?: number
    /**
     * 重试次数
     */
    retryTimes?: number
    /**
     * 重试间隔
     */
    retryDelay?: number
  }
}
const instance = axios.create({
  retryTimes: 3,
  validateStatus(status) {
    return status < 400
  },
})

instance.interceptors.request.use(
  (config) => {
    if (config.headers) {
      // @ts-expect-error: xx
      config.headers = {
        ...config.headers,
        'X-API-VERSION': 'v1',
      }
    }
    return config
  },
  (e) => {
    console.log('request error', e)
  }
)
instance.interceptors.response.use(
  (res: AxiosResponse<BaseResponse<AnyToFix>>) => {
    const { data, status } = res

    if (status === 200) return data.data
    else return Promise.reject(data)
  },
  (e: AxiosError) => {
    console.log('response error: ', e.response?.status)
    // 传递错误响应
    return Promise.reject(e)
  }
)

instance.interceptors.response.use(null, (error: AxiosError) => {
  const config = error.config
  console.log(new Date().toLocaleTimeString(), config?.url, '_retryCount: ', config?._retryCount)
  if (!config || !config.retryTimes) return Promise.reject(error)
  const { _retryCount = 0, retryDelay = 1000, retryTimes } = config
  config._retryCount = _retryCount

  if (_retryCount >= retryTimes) return Promise.reject(error)

  config._retryCount += 1
  // 延时重试，延时时间随着重试次数增加
  const delay = new Promise((resolve) => setTimeout(resolve, retryDelay * _retryCount))
  return delay.then(() => instance(config))
})

export default instance
