// import type { Row } from '@tanstack/table-core';
import type { PostPictures } from '@prisma/client';

export interface PostsDataTable {
	postTitle: string;
	tags: string;
	published: boolean;
	createdAt: string;
	publishedAt: string;
	view: string;
	edit: string;
}

export type UserImageAPIData = {
	page: number;
	limit: number;
	total: number;
	images: PostPictures[];
};
