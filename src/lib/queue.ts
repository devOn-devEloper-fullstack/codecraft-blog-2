// src/lib/queue.ts
import { Queue, Worker, QueueEvents } from 'bullmq';
import { makeIORedis } from './redis';

const connection = makeIORedis();
const prefix = process.env.REDIS_PREFIX || 'codecraft'; // namespaces keys

export function makeQueue(name: string) {
  return new Queue(name, {
    connection,
    prefix,                 // keeps your keys grouped in Redis
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 1000,
      attempts: 1
      // backoff: { type: 'exponential', delay: 2000 }
    },
    // Optional: limiter for OpenAI rate limits (tune as needed)
    // limiter: { max: 1, duration: 1000 }
  });
}

export function makeWorker<T = any>(name: string, processor: any, concurrency = 5) {
  return new Worker<T>(name, processor, {
    connection,
    prefix,
    concurrency,
    limiter: { max: 1, duration: 1000 },
    // auto-respawn on connection loss:
    autorun: true
  });
}

export function makeQueueEvents(name: string) {
  return new QueueEvents(name, { connection, prefix });
}
