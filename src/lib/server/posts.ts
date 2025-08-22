import { prisma } from './prisma';
import type { Prisma } from '@prisma/client';

type PostInput = Prisma.PostsCreateInput;

export async function addPost(input: PostInput) {
	const { published, ...data } = input;
	return prisma.posts.create({
		data: {
			...data,
			published: !!published,
			// @ts-expect-error This syntax is acceptable. Do not know how to fix type error.
			publishedAt: published ? new Date() : null
		}
	});
}

export async function deletePost(input: PostInput) {
	return await prisma.posts.delete({
		where: {
			id: input.id
		}
	});
}

export async function getPostsById(postId: string) {
	return await prisma.posts.findUnique({
		where: {
			id: postId
		}
	});
}
