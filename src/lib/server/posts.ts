import { prisma } from './prisma';
import type { User, Prisma } from '@prisma/client';

type PostInput = Prisma.PostsCreateInput & { userId: string };
type UserType = User['id'];

type EditPostBody = {
	contentHtml: string;
};
export async function addPost(input: PostInput & { contentHtml: string }) {
	// Exclude User and editor properties if present
	const { published, User, editor, contentHtml, ...rest } = input;
	return prisma.posts.create({
		data: {
			...rest,
			contentHtml: contentHtml,
			contentJson: input.contentJson || null,
			published: !!published,
			publishedAt: published ? new Date() : null,
			userId: input.userId,
			revisions: {
				create: [
					{
						content: contentHtml,
						summary: null,
						createdBy: '',
						version: 1
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
		},
		include: {
			User: true,
			currentRevision: true
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

export async function updatePostBody(id: string, data: EditPostBody) {
	return await prisma.posts.update({
		where: {
			id: id
		},
		data: {
			contentHtml: data.contentHtml,
			revisions: {
				create: [
					{
						content: data.contentHtml,
						summary: null,
						createdBy: '',
						version: await prisma.revision
							.count({ where: { postId: id } })
							.then((count) => count + 1)
					}
				]
			}
		},
		include: {
			revisions: true,
			currentRevision: true
		}
	});
}

export async function updatePostMetadata(id: string, data: Partial<PostInput>) {
	// Exclude userId from update data, as Prisma does not allow updating userId
	const { userId, ...updateData } = data;
	return await prisma.posts.update({
		where: {
			id: id
		},
		data: {
			...updateData
		}
	});
}

export async function publishPost(id: string, data: string) {
	return await prisma.posts.update({
		where: {
			id: id
		},
		data: {
			contentHtml: data,
			published: true,
			status: 'PUBLISHED',
			publishedAt: new Date(),
			revisions: {
				create: [
					{
						content: data,
						summary: null,
						createdBy: '',
						version: await prisma.revision
							.count({ where: { postId: id } })
							.then((count) => count + 1)
					}
				]
			}
		},
		include: {
			revisions: true
		}
	});
}

export async function setPostStatus(
	id: string,
	status: 'DRAFT' | 'PUBLISHED' | 'REJECTED' | 'SUBMITTED'
) {
	return await prisma.posts.update({
		where: {
			id: id
		},
		data: {
			status: status
		}
	});
}

export async function getAllPublishedPosts(limit = 10) {
	return await prisma.posts.findMany({
		where: { published: true },
		take: limit,
		include: { User: true, currentRevision: true, stats: true}
	});
}

export async function likePost(postId: string, userId: string) {
	const liked = await prisma.postLike.create({
		data: {
			postId,
			userId
		}
	});

	const postStat = await prisma.postStats.upsert({
		where: { postId },
		update: { likeCount: { increment: 1 } },
		create: { postId, likeCount: 1, viewCount: 1 }
	});

	return { liked, postStat };
}

export async function unlikePost(postId: string, userId: string) {
	const unliked = await prisma.postLike.deleteMany({
		where: {
			postId,
			userId
		}
	});

	const postStat = await prisma.postStats.update({
		where: { postId },
		data: { likeCount: { decrement: 1 } }
	});

	return { unliked, postStat };
}

export async function getPostLikeForUser(postId: string, userId: string) {
	return await prisma.postLike.findFirst({
		where: {
			postId,
			userId
		}
	});
}
