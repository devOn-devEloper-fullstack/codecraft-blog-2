// scripts/queues-snapshot.ts
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import 'dotenv/config';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? '6379'),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB ?? '0'),
});

const prefix = process.env.REDIS_PREFIX ?? 'codecraft';

async function snapshot(name: string) {
  const q = new Queue(name, { connection, prefix });
  const counts = await q.getJobCounts('waiting','active','completed','failed','delayed','paused');
  console.log(`[${name}]`, counts);
  console.log(`[${name}] isPaused=${await q.isPaused()}`);
  const [waiting] = await q.getJobs(['waiting'], 0, 0, true);
  if (waiting) console.log(`[${name}] top waiting job`, waiting.id, waiting.data);
}

(async () => {
  await snapshot('autoModeration_fifo');
  await snapshot('humanReview_fifo');
  process.exit(0);
})();
