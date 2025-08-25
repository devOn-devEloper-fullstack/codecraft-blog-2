import type { PageServerLoad } from './$types';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3, S3_BUCKET, encodeKey } from '$lib/server/s3';

export const load: PageServerLoad = async () => {
	// List the first 1000 objects (tweak as needed; paginate if you have more)
	const cmd = new ListObjectsV2Command({
		Bucket: S3_BUCKET
		// Prefix: 'optional/folder/',
		// MaxKeys: 100
	});

	const res = await s3.send(cmd);
	const items = (res.Contents ?? [])
		.filter((obj) => !!obj.Key)
		.map((obj) => {
			const key = obj.Key!;
			return {
				key,
				// App-level URL that hides S3 and will mint a presigned URL at request time
				url: `/img/${encodeKey(key)}`
			};
		});

	return { items };
};
