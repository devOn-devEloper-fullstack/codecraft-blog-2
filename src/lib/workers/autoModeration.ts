// workers/autoModeration.ts
import { Job } from 'bullmq';
import crypto from 'crypto';
import { prisma } from '$lib/server/prisma';
import OpenAI from 'openai';
import { makeQueue, makeWorker } from '$lib/queue';
import { humanQ } from '$lib/workers/humanReview';

export const autoQ = makeQueue('autoModeration_fifo');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type AutoJobData = { postId: string; postVersion: number };

export async function enqueueAutoModeration(postId: string, postVersion: number) {
  const post = await prisma.posts.findUniqueOrThrow({ where: { id: postId } });
  const payload = `${post.postTitle}\n\n${post.contentHtml}\n#v${postVersion}`;
  const requestHash = crypto.createHash('sha256').update(payload).digest('hex');
  const idempotencyKey = `auto:${postId}:${postVersion}:${requestHash}`;

  await prisma.moderationJob.upsert({
    where: { idempotencyKey },
    update: {},
    create: {
      postId,
      postVersion,
      idempotencyKey,
      provider: 'openai',
      providerModel: 'omni-moderation-latest',
      requestHash,
      status: 'QUEUED'
    }
  });

  const job = await autoQ.add(
    'moderate',
    { postId, postVersion } as AutoJobData,
    {
      jobId: idempotencyKey,        // prevents duplicates
      attempts: 5,
      // backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 1000
    }
  );
  console.log('[enqueue] added', job.id, 'state=', await job.getState());

  await prisma.posts.update({ where: { id: postId }, data: { status: 'PENDING_AUTO' }});
}

makeWorker<AutoJobData>(
  'autoModeration_fifo',
  async (job: Job<AutoJobData>) => {
    console.log(`Processing job ${job.id}`);
    const { postId, postVersion } = job.data;
    await prisma.moderationJob.updateMany({ where: { idempotencyKey: job.id! }, data: { status: 'RUNNING', attempts: { increment: 1 }}});
    console.log(`Moderating post ${postId} version ${postVersion}`);
    const post = await prisma.posts.findUniqueOrThrow({ where: { id: postId } });

    console.log(`Calling OpenAI Moderation API for post ${postId} version ${postVersion}`);

    // Call OpenAI Moderations API (text only here, but omni supports images too)
    // Endpoint: POST /v1/moderations; Model: omni-moderation-latest
    const input = `${post.postTitle}\n\n${post.contentHtml}`;
    const resp = await openai.moderations.create({
      model: 'omni-moderation-latest',
      input: input
    });

    console.log(resp);

    const result = resp.results?.[0] ?? resp; // shape depends on SDK version
    // Build a routing decision with your thresholds
    const flagged = Boolean(result.flagged);
    const categories = result.categories as unknown as Record<string, boolean>;
    const scores = result.category_scores as unknown as Record<string, number>;

    let outcome: 'PASS' | 'ESCALATE' | 'BLOCK' = 'PASS';
    let reason = '';

    console.log(flagged)

    // Example routing policy (customize!):
    if (flagged) {
      // Hard block for sexual/minors if present in categories

      const top = Object.entries(scores).sort((a,b) => b[1]-a[1])[0];
      console.log(top)
      if (categories?.['sexual/minors']) {
        outcome = 'BLOCK';
        reason = 'openai.flag:sexual/minors';
      } else if (top?.[1] > 0.9) {
        outcome = 'BLOCK';
        reason = `openai.flag:${top?.[0] ?? 'unknown'}`;
      } else {
        outcome = 'ESCALATE';
        // pick the highest score category as reason
        reason = `openai.flag:${top?.[0] ?? 'unknown'}`;
      }
    }

    await prisma.moderationJob.updateMany({ where: { idempotencyKey: job.id! }, data: { status: 'SUCCESSFUL', result: resp as any }});

    if (outcome === 'PASS') {
      await prisma.decision.create({
        data: { postId, postVersion, decidedBy: 'system', outcome: 'APPROVE', rationale: 'Auto moderation pass', data: resp as any }
      });
      await prisma.posts.update({ where: { id: postId }, data: { status: 'APPROVED', published: true, publishedAt: new Date(), revisions: { create: [{
        content: post.contentHtml, summary: null, createdBy: await prisma.posts.findUniqueOrThrow({ where: { id: postId } }).then(p => p.userId) as string, version: await prisma.revision.count({ where: { postId } }).then(count => count + 1) }]}
      }});
    } else if (outcome === 'BLOCK') {
      await prisma.decision.create({
        data: { postId, postVersion, decidedBy: 'system', outcome: 'REJECT', rationale: reason, data: resp as any }
      });
      await prisma.posts.update({ where: { id: postId }, data: { status: 'REJECTED' }});
    } else {
      await prisma.reviewTask.upsert({
        where: { postId_postVersion: { postId, postVersion } },
        create: { postId, postVersion, reason, status: 'OPEN' },
        update: { reason }
      });
      await humanQ.add('review', { postId, postVersion }, { removeOnComplete: 1000 });
      await prisma.posts.update({ where: { id: postId }, data: { status: 'PENDING_HUMAN' }});
    }
  }, 1).on('failed', async (job, err) => {
  await prisma.moderationJob.updateMany({ where: { idempotencyKey: job?.id! }, data: { status: 'FAILED', error: String(err) }});
});
