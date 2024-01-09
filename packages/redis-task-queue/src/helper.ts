import type { RedisOptions } from 'ioredis'
import Redis from 'ioredis'

export const getRedisClient = (options?: RedisOptions) =>
  new Redis({
    port: 6379,
    host: '127.0.0.1',
    db: 0,
    ...options,
  })
