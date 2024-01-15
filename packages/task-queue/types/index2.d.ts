import type { EventCB, ITaskQueue, Option, Task } from './type';
/**
 * 任务队列
 *
 * 类似job的概念
 *
 * 微任务/宏任务思想
 *
 * TODO 优先级？
 */
export default class TaskQueue<T, R> implements ITaskQueue<T, R> {
    private interval;
    private autoStart;
    /**
     * @type {boolean} 是否同步执行任务
     */
    private wait;
    private ignoreError;
    /** 待执行的任务 */
    private queue;
    /** 正在执行的任务 */
    private executing;
    /** 已执行的任务 */
    private executed;
    /** 执行任务的方式 */
    private taskCommand;
    private max;
    private eventEmitter;
    /** 停止标志位 */
    private stopSign;
    private timeoutId;
    private intervalId;
    constructor(option?: Option<T, R>);
    /**
     * 手动启动任务，如果autoStart=true，在第一条任务添加进队列后，会自动运行
     */
    start(): Promise<unknown>;
    /**
     * 重启队列中的任务，并使用新的配置处理未执行任务
     */
    restart(): void;
    /**
     * 停止当前所有任务，直到start或者队列长度再次为0时
     */
    stop(): void;
    clear(): void;
    subscribe(event: EventCB<R>): void;
    removeSubscribe(event: EventCB<R>): void;
    info(): {
        progress: number;
        executed: Task<T>[];
        executing: Task<T>[];
        waitExecute: Task<T>[];
    };
    addQueue(task: T): void;
    /**
     * 移除任务
     * @param task
     */
    private removeTask;
    /**
     * 同步执行任务
     */
    private syncRun;
    /**
     * 异步执行任务
     */
    private asyncRun;
}
