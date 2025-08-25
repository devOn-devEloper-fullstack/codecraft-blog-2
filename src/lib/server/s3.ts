import { S3Client } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

export const s3 = new S3Client({
	region: env.S3_REGION,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY_ID!,
		secretAccessKey: env.S3_SECRET_ACCESS_KEY!
	}
});

export const S3_BUCKET = env.S3_BUCKET!;
export const S3_URL_TTL = Number(env.S3_URL_TTL ?? 300); // default 5 min

// Helpers to safely encode/decode S3 keys for route params
export const encodeKey = (k: string) => encodeURIComponent(k);
export const decodeKey = (k: string) => decodeURIComponent(k);
