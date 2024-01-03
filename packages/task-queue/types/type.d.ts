/// <reference types="node" />
import type EventEmitter from 'events';
/**
 * 队列配置项
 */
export interface Option<T, R> {
    /**
     * 时间间隔
     *
     * 在非初始化后修改，需要调用restart才会生效
     */
    interval?: number;
    key?: string;
    /**
     * 是否自动开始
     */
    autoStart?: boolean;
    /**
     * 是否启用等待执行（上一个任务执行完毕，下一个才开始）
     *
     * 在非初始化后修改，需要调用restart才会生效
     */
    wait?: boolean;
    /**
     * 是否忽略任务对队列中的错误
     */
    ignoreError?: boolean;
    /**
     * 所有待执行任务
     */
    queue?: Task<T>[];
    /**
     * 所有正在执行的任务
     */
    executing?: Task<T>[];
    /**
     * 所有已执行的任务
     */
    executed?: Task<T>[];
    /**
     * 具体的执行命令
     * @param task
     * @returns
     */
    taskCommand?: (task: Task<T>) => Promise<R | void>;
    /**
     * 队列最大长度，0为不限制
     */
    max?: number;
    /**
     * 事件模块
     */
    eventEmitter?: EventEmitter;
}
/**
 * 进度管理类
 */
export interface Progress<T> {
    progress: number;
    executing: Task<T>[];
    executed: Task<T>[];
    waitExecute: Task<T>[];
}
/**
 * 任务实体
 */
export interface Task<T> {
    task: T;
    no: string;
}
/**
 * 事件回调
 */
export type EventCB<R> = (e: Error | null, result: R) => void;
export interface ITaskQueue<T, R> {
    /**
     * 订阅事件
     * @param event
     * @returns
     */
    subscribe: (event: EventCB<R>) => void;
    /**
     * 不再订阅事件
     * @param event
     * @returns
     */
    removeSubscribe: (event: EventCB<R>) => void;
    /**
     * 任务进度
     * @returns
     */
    info: () => Progress<T>;
    /**
     * 添加任务到队列中
     * @returns
     */
    addQueue: (task: T) => void;
    /**
     * 启动任务
     * @returns
     */
    start: () => void;
    /**
     * 重启任务
     * @returns
     */
    restart: () => void;
    /**
     * 停止任务
     * @returns
     */
    stop: () => void;
    /**
     * 清除任务
     * @returns
     */
    clear: () => void;
}
