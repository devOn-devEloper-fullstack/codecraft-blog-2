import type { RequestHandler } from './$types';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3_BUCKET, S3_URL_TTL, decodeKey } from '$lib/server/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const raw = params.key ?? '';
	const s3Key = decodeKey(raw);
	if (!s3Key || s3Key.startsWith('../') || s3Key.startsWith('/')) {
		return new Response('Invalid key', { status: 400 });
	}

	const signed = await getSignedUrl(s3, new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key }), {
		expiresIn: S3_URL_TTL
	});

	const res = await fetch(signed);
	if (!res.ok) return new Response('Not found', { status: 404 });

	// Pass through headers that make sense for images
	const headers = new Headers();
	const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
	headers.set('Content-Type', contentType);
	const etag = res.headers.get('etag');
	if (etag) headers.set('ETag', etag);
	const length = res.headers.get('content-length');
	if (length) headers.set('Content-Length', length);
	// Cache the proxy response a bit if desired
	headers.set('Cache-Control', 'private, max-age=300');

	return new Response(res.body, { status: 200, headers });
};
