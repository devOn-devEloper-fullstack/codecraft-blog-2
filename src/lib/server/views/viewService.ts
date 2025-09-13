import { prisma } from '$lib/server/prisma';
import crypto from 'crypto';

const DEDUPE_WINDOW_HOURS = 8;
const HMAC_SALT = process.env.VIEW_ANON_HMAC_SALT ?? 'DquVWaugjdygJTgfMSTJ';

export type RecordViewInput = {
	postId: string;
	userId?: string | null;
	anonId?: string | null;
	tVisibleMs?: number | null;
	scrollPercent?: number | null;
	userAgent?: string | null;
	ip?: string | null;
};

export type RecordViewResult = {
	recorded: boolean;
	updatedExisting: boolean;
	eventId?: string;
};

function hmac(input: string) {
	return crypto.createHmac('sha256', HMAC_SALT).update(input).digest('hex');
}

function hash(input: string) {
	return crypto.createHash('sha256').update(input).digest('hex');
}

function isBotUA(ua?: string | null) {
	if (!ua) return false;
	return /bot|crawler|spider|crawling|preview|linkchecker|archive|headless|prerender|selenium|playwright/i.test(
		ua
	);
}

export async function recordView(input: RecordViewInput): Promise<RecordViewResult> {
	const { postId } = input;

	const now = new Date();

	const anonHash = input.anonId ? hmac(input.anonId) : null;
	const uaHash = input.userAgent ? hash(input.userAgent) : null;
	const ipHash = input.ip ? hash(input.ip) : null;

	if (isBotUA(input.userAgent)) {
		return { recorded: false, updatedExisting: false };
	}

	const actorKey = input.userId ?? anonHash;
	const windowStart = new Date(now.getTime() - DEDUPE_WINDOW_HOURS * 3600 * 1000);

	const existing = actorKey
		? await prisma.postViewEvent.findFirst({
				where: {
					postId,
					ts: { gte: windowStart },
					OR: [
						{ userId: input.userId ?? undefined },
						{ anonHash: input.anonId ? anonHash : undefined }
					]
				},
				orderBy: { ts: 'desc' },
				select: { id: true, tVisibleMs: true, scrollPercent: true }
			})
		: null;

	if (existing) {
		const updated = await prisma.postViewEvent.update({
			where: {
				id: existing.id
			},
			data: {
				tVisibleMs: Math.max(existing.tVisibleMs ?? 0, input.tVisibleMs ?? 0),
				scrollPercent: Math.max(existing.scrollPercent ?? 0, input.scrollPercent ?? 0)
			},
			select: { id: true }
		});

		return { recorded: false, updatedExisting: true, eventId: updated.id };
	}

	const created = await prisma.postViewEvent.create({
		data: {
			postId,
			userId: input.userId ?? null,
			anonHash,
			ts: now,
			tVisibleMs: input.tVisibleMs ?? null,
			scrollPercent: input.scrollPercent ?? null,
			uaHash,
			ipHash
		},
		select: { id: true }
	});

	await prisma.postStats.upsert({
		where: { postId },
		create: {
			postId,
			viewCount: BigInt(1)
		},
		update: {
			viewCount: { increment: BigInt(1) }
		}
	});

	return { recorded: true, updatedExisting: false, eventId: created.id };
}
