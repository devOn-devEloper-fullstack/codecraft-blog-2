import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	const posts = await prisma.posts.findMany({
		where: { published: true },
		orderBy: { publishedAt: 'desc' },
		include: { User: true }
	});
	return { posts };
};
