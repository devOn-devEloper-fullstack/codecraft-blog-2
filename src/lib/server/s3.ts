import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import type { Session } from '@prisma/client';

type ItemType = {
	key: string;
	url: string;
};

type UserImagesConfig = {
	S3_BUCKET: string;
	maxKeys: number;
};

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

/**
 * Wrapper for Amazon SDK for S3; Fetches objects in an S3 bucket affiliated with a given user.
 * @param s3
 * @param session
 * @param config
 * @returns An array of item objects that contain the key and url for each of the images affiliated with the given signed in user.
 */

export async function fetchUserImages(
	s3: S3Client,
	session: Session,
	config: UserImagesConfig
): Promise<ItemType[]> {
	const accessS3 = new ListObjectsV2Command({
		Bucket: config.S3_BUCKET,
		Prefix: `image-gallery/${session.userId}`,
		MaxKeys: config.maxKeys
	});

	const imageObjects = await s3.send(accessS3);
	const items = (imageObjects.Contents ?? [])
		.filter((item) => !!item.Key)
		.map((item) => {
			const key = item.Key!;
			return {
				key,
				// App-level URL that hides S3 and will mint a presigned URL at request time
				url: `/img/${encodeKey(key)}`
			};
		});

	return items;
}
