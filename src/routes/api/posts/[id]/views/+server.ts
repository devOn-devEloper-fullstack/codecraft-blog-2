import { recordView } from '$lib/server/views/viewService';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const BodySchema = z.object({
	context: z
		.object({
			tVisibleMs: z.number().int().nonnegative().max(120_000).optional(),
			scrollPercent: z.number().min(0).max(100).optional(),
			anonId: z.string().min(8).max(100).optional()
		})
		.partial()
		.optional()
});

function getClientIp(request: Request): string | null {
	const fwd = request.headers.get('x-forwarded-for');
	if (fwd) {
		const ip = fwd.split(',')[0].trim();
		if (ip) return ip;
	}

	const anyEvent = request as unknown as { getClientAddress?: () => string | null };
	try {
		const ip2 = anyEvent.getClientAddress?.();
		if (ip2) return ip2;
	} catch {
		/* empty */
	}

	return null;
}

export const POST: RequestHandler = async ({ request, params, locals }) => {
	try {
		const postId = params.id as string;
		const body = await request.json();
		const payload = BodySchema.safeParse(body);

		if (!payload.success) {
			return error(
				400,
				JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'Invalid request body' } })
			);
		}

		const ctx = payload.data.context ?? {};

		const result = await recordView({
			postId,
			userId: locals.user?.id ?? null,
			anonId: ctx.anonId ?? null,
			tVisibleMs: ctx.tVisibleMs ?? null,
			scrollPercent: ctx.scrollPercent ?? null,
			userAgent: request.headers.get('user-agent') ?? null,
			ip: getClientIp(request)
		});

		return json({ record: result.recorded }, { status: 202 });
	} catch (err) {
		console.error('Failed to record view', err);
		return error(
			500,
			JSON.stringify({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to record view' } })
		);
	}
};
