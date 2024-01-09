import type { Redis } from 'ioredis'
import redis from 'ioredis'

export const getRedisClient = (...args: ConstructorParameters<typeof Redis>) => {
  return redis.createClient(...args)
}
