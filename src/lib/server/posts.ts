import { prisma } from './prisma';
import type { User, Prisma } from '@prisma/client';

type PostInput = Prisma.PostsCreateInput & { userId: string };
type UserType = User['id'];
export async function addPost(input: PostInput) {
	const { published, ...data } = input;
	return prisma.posts.create({
		data: {
			...data,
			published: !!published,
			publishedAt: published ? new Date() : null,
			userId: input.userId,
			revisions: {
				create: [
					{
						content: data.contentHtml,
						summary: null,
						createdBy: ''
					}
				]
			}
		},
		include: {
			revisions: true
		}
	});
}

export async function setCurrentRevision(postId: string, revisionId: string) {
	return prisma.posts.update({
		where: {
			id: postId
		},
		data: {
			currentRevision: {
				connect: {
					id: revisionId
				}
			}
		},
		include: {
			currentRevision: true
		}
	});
}

export async function deletePost(postId: string) {
	return await prisma.posts.delete({
		where: {
			id: postId
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

export async function getAllPostsByUser(userId: UserType) {
	return await prisma.posts.findMany({
		where: {
			userId: userId
		},
		include: { User: true }
	});
}
