import { prisma } from './prisma';

//---- Admin Analytics ----//

export async function totalUsersAnalytics() {
	const totalUsers = await prisma.user.count();
	return totalUsers;
}

export async function totalUsersByDate() {
	const usersByDate = await prisma.user.groupBy({
		by: ['createdAt'],
		_count: { id: true },
		orderBy: { createdAt: 'asc' }
	});
	return usersByDate;
}

export async function totalPostsAnalytics() {
	const totalPosts = await prisma.posts.count();
	return totalPosts;
}

export async function totalPostsByDate() {
	const postsByDate = await prisma.posts.groupBy({
		by: ['createdAt'],
		_count: { id: true },
		orderBy: { createdAt: 'asc' }
	});
	return postsByDate;
}

export async function totalLikesAnalytics() {
	const totalLikes = await prisma.postLike.count();
	return totalLikes;
}

export async function totalLikesByDate() {
	const likesByDate = await prisma.postLike.groupBy({
		by: ['createdAt'],
		_count: { id: true },
		orderBy: { createdAt: 'asc' }
	});
	return likesByDate;
}

export type TotalPostLikesByDate = Awaited<ReturnType<typeof totalLikesByDate>>;