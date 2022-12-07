export interface LoaderOptionsCache {
  [name: string]: WeakMap<LoaderOptions, LoaderOptions>
}
export type LogLevel = 'INFO' | 'WARN' | 'ERROR'
export interface LoaderOptions {
  silent: boolean
  /**
   * 是否开启logger(webpack内置)
   */
  showLogger?: boolean
  /**
   * 日志是否写入文件
   */
  saveToDisk?: boolean
  /**
   * 日志文件名
   */
  logFileName?: string
  /**
   * 格式化输出
   */
  formater?: (resourcePath: string) => string
  /**
   * 是否显示每次启动的分割线
   */
  showGap?: boolean
}
