// Centralized DB access for images
import { prisma } from '$lib/server/prisma';
import type { PostPictures } from '@prisma/client';

export type NewImage = {
	userId: string;
	postId: string | null;
	bucket: string;
	region: string | null;
	key: string;
	url: string;
	etag: string | null;
	checksum: string | null;
	mimeType: string;
	sizeBytes: number | null;
	width: number | null;
	height: number | null;
	placeholder: string;
	alt: string | null;
	caption: string | null;
	indexInHtml: number | null;
};

export async function createImage(data: NewImage): Promise<PostPictures> {
	return prisma.postPictures.create({ data });
}

export async function createImagesBulk(items: NewImage[]): Promise<PostPictures[]> {
	if (!items.length) return [];
	return prisma.$transaction(items.map((data) => prisma.postPictures.create({ data })));
}

export async function getImageByKeyForUser(
	key: string,
	userId: string
): Promise<PostPictures | null> {
	return prisma.postPictures.findFirst({ where: { key, userId } });
}

/**
 * Makes a database call to retrieve all image metadata for a given user.
 * @param userId
 * @param limit
 * @returns Array of image metadata
 */

export async function listImagesForUser(userId: string, limit = 100): Promise<PostPictures[]> {
	return prisma.postPictures.findMany({
		where: { userId },
		orderBy: { createdAt: 'desc' },
		take: limit
	});
}

export async function listImagesForKeys(keys: Array<NewImage['key']>): Promise<PostPictures[]> {
	return prisma.postPictures.findMany({
		where: {
			key: {
				in: keys
			}
		}
	});
}
