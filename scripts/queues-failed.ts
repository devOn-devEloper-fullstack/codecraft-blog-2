// scripts/queues-failed.ts
import 'dotenv/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST ?? '127.0.0.1',
  port: Number(process.env.REDIS_PORT ?? '6379'),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: Number(process.env.REDIS_DB ?? '0'),
});

const prefix = process.env.REDIS_PREFIX ?? 'codecraft';
const name = process.env.QNAME ?? 'autoModeration_fifo';

(async () => {
  const q = new Queue(name, { connection, prefix });

  // get first page of failed jobs
  const failed = await q.getJobs(['failed'], 0, 10, true);
  if (failed.length === 0) {
    console.log('No failed jobs found');
    process.exit(0);
  }

  for (const job of failed) {
    const st = await job.getState();
    console.log('---');
    console.log('id:', job.id);
    console.log('name:', job.name);
    console.log('state:', st);
    console.log('data:', job.data);
    console.log('failedReason:', job.failedReason);
    console.log('stacktrace:', job.stacktrace);
    // Logs are not directly accessible via BullMQ Job API.
    // If you store logs in job.data or job.returnvalue, access them here.
    // Example:
    // console.log('processor logs:', job.data.logs);
  }
  process.exit(0);
})();
