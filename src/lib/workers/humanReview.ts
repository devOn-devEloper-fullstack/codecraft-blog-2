// workers/humanReview.ts
import { Job } from 'bullmq';
import { prisma } from '$lib/server/prisma';
import { makeQueue, makeWorker } from '$lib/queue';

export const humanQ = makeQueue('humanReview_fifo');

type HumanJob = { postId: string; postVersion: number };

makeWorker<HumanJob>(
  'humanReview_fifo',
  async (job: Job<HumanJob>) => {
    // This worker can send notifications, create Slack threads, etc.
    // Keep it lightweight; primary review happens in the dashboard.
    await prisma.auditLog.create({
      data: {
        subject: `ReviewTask:${job.data.postId}:${job.data.postVersion}`,
        action: 'ENQUEUED_FOR_REVIEW',
        meta: job.data as any
      }
    });
  },
   2 
);
