import type { RequestHandler } from './$types';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import crypto from 'crypto';
import prisma from '$lib/server/prisma';
import { S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } from '$env/static/private';

const s3 = new S3Client({
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY
	}
});

export const POST: RequestHandler = async ({ request }) => {
	const form = await request.formData();
};
