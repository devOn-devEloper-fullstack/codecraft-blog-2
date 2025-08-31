import { listImagesForUser } from '$lib/server/images';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const token = cookies.get('better-auth.session_token');

	const limit = parseInt(url.searchParams.get('limit') ?? '10');
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const start = (page - 1) * limit;

	if (token) {
		const parsedToken = token.split('.')[0];
		const session = await prisma.session.findUnique({
			where: {
				token: parsedToken
			}
		});

		const validSession = session?.token ? true : false;

		if (!validSession) {
			return new Response('Unauthorized', { status: 401 });
		}

		if (session?.userId) {
			const imageMeta = await listImagesForUser(session.userId, 100);

			const images = imageMeta.slice(start, start + limit);

			return new Response(
				JSON.stringify({
					page,
					limit,
					total: imageMeta.length,
					images: images
				}),
				{ status: 200 }
			);
		} else {
			return new Response('There has been an unexcepted error. Please try again later', {
				status: 500
			});
		}
	} else {
		return new Response('Unauthorized', { status: 401 });
	}
};
