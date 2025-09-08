// scripts/reset-queues-and-db.ts
// Usage examples:
//   DRY RUN (see what would happen)
//     node -r dotenv/config -e "require('ts-node/register'); require('./scripts/reset-queues-and-db')({ dry: true, postId: 'POST_CUID' })"
//   With tsx (recommended):
//     tsx scripts/reset-queues-and-db.ts --postId POST_CUID --dry
//   Execute (targeted):
//     tsx scripts/reset-queues-and-db.ts --postId POST_CUID
//   Execute (everything: dev only!):
//     tsx scripts/reset-queues-and-db.ts --all
//
// Env it uses:
//   REDIS_URL or { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD, REDIS_DB, REDIS_PREFIX }
//   DATABASE_URL (for Prisma)
//   QUEUES (optional, comma-separated, default: autoModeration_fifo,humanReview_fifo)
//   RESET_POST_TO_DRAFT=true (optional: also set Post.status='DRAFT' when --postId is used)

import 'dotenv/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient, PostStatus } from '@prisma/client';

type Options = {
  all?: boolean;
  postId?: string;
  dry?: boolean;
};

function parseArgs(): Options {
  const a = new Map<string, string | boolean>();
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--')) {
      const [k, v] = arg.replace(/^--/, '').split('=');
      a.set(k, v ?? true);
    }
  }
  return {
    all: Boolean(a.get('all')),
    postId: (a.get('postId') as string) ?? undefined,
    dry: Boolean(a.get('dry'))
  };
}

function makeIORedis() {
  const url = process.env.REDIS_URL;
  if (url) return new IORedis(url, { enableReadyCheck: true, maxRetriesPerRequest: null });

  return new IORedis({
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB ?? '0'),
    enableReadyCheck: true,
    maxRetriesPerRequest: null
  });
}

async function obliterateQueues(conn: IORedis, queues: string[], prefix: string, dry: boolean) {
  for (const name of queues) {
    const q = new Queue(name, { connection: conn, prefix });
    const counts = await q.getJobCounts('waiting','active','delayed','completed','failed','paused');

    console.log(`Queue ${prefix}:${name} counts =>`, counts);
    if (dry) {
      console.log(`[dry] would obliterate queue ${prefix}:${name}`);
      continue;
    }
    await q.obliterate({ force: true }); // removes ALL jobs for that queue
    console.log(`Obliterated queue ${prefix}:${name}`);
    await q.close();
  }
}

async function resetDb(prisma: PrismaClient, opts: Options, dry: boolean) {
  if (opts.all) {
    console.log('DB reset scope: ALL POSTS (dev only)');
    if (dry) {
      console.log('[dry] would delete ALL ModerationJob, ReviewTask, Decision rows');
      return;
    }
    await prisma.$transaction([
      prisma.decision.deleteMany({}),
      prisma.reviewTask.deleteMany({}),
      prisma.moderationJob.deleteMany({})
    ]);
    console.log('Deleted ALL decisions/reviewTasks/moderationJobs');
    return;
  }

  if (!opts.postId) {
    console.log('DB reset scope: none (no --postId and not --all). Skipping DB changes.');
    return;
  }

  const post = await prisma.posts.findUnique({ where: { id: opts.postId }, include: { currentRevision: true } });
  if (!post) {
    console.warn(`Post ${opts.postId} not found. Skipping DB changes.`);
    return;
  }

  console.log(`DB reset scope: postId=${opts.postId} (version=${post.currentRevision?.version})`);
  if (dry) {
    console.log('[dry] would delete Decisions/ReviewTasks/ModerationJobs for that post');
    if (process.env.RESET_POST_TO_DRAFT === 'true') {
      console.log('[dry] would set Post.status=DRAFT');
    }
    return;
  }

  await prisma.$transaction([
    prisma.decision.deleteMany({ where: { postId: opts.postId } }),
    prisma.reviewTask.deleteMany({ where: { postId: opts.postId } }),
    prisma.moderationJob.deleteMany({ where: { postId: opts.postId } }),
    ...(process.env.RESET_POST_TO_DRAFT === 'true'
      ? [prisma.posts.update({ where: { id: opts.postId }, data: { status: PostStatus.DRAFT } })]
      : [])
  ]);

  console.log(`Cleared Decisions/ReviewTasks/ModerationJobs for post ${opts.postId}`);
  if (process.env.RESET_POST_TO_DRAFT === 'true') {
    console.log('Post.status set to DRAFT');
  }
}

async function main() {
  const opts = parseArgs();

  if (!opts.all && !opts.postId) {
    console.error('Must pass either --postId <id> (recommended) or --all (dev only). Add --dry to preview.');
    process.exit(1);
  }

  const queuesEnv = process.env.QUEUES ?? 'autoModeration_fifo,humanReview_fifo';
  const queues = queuesEnv.split(',').map(s => s.trim()).filter(Boolean);
  const prefix = process.env.REDIS_PREFIX ?? 'codecraft';

  console.log('--- Reset Plan ---');
  console.log('Queues:', queues.map(q => `${prefix}:${q}`).join(', '));
  console.log('Scope:', opts.all ? 'ALL' : `postId=${opts.postId}`);
  console.log('Dry run:', !!opts.dry);
  console.log('------------------');

  const prisma = new PrismaClient();
  const conn = makeIORedis();

  try {
    // 1) Obliterate queues
    await obliterateQueues(conn, queues, prefix, !!opts.dry);

    // 2) Clear DB rows (and optionally reset post to DRAFT)
    await resetDb(prisma, opts, !!opts.dry);

    // (Optional) If you also stored idempotency keys in some other table, clear them here.
  } finally {
    await prisma.$disconnect();
    await conn.quit();
  }

  console.log('Reset complete.');
}

main().catch((e) => {
  console.error('Reset failed:', e);
  process.exit(1);
});
