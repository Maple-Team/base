import { AxiosRequestConfig } from 'axios';
/**
 * 统一请求入口
 * @param config
 * @returns
 */
export declare const request: <T = any>(config: AxiosRequestConfig) => Promise<T>;
