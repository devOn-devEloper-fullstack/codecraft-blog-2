import { listImagesForUser } from '$lib/server/images';
import { prisma } from '$lib/server/prisma';
import { fetchUserImages } from '$lib/server/s3';
import type { RequestHandler } from '@sveltejs/kit';
import { s3, S3_BUCKET } from '$lib/server/s3';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('better-auth.session_token');

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
			const imageMeta = await listImagesForUser(session.userId, 50);

			const images = await fetchUserImages(s3, session, { S3_BUCKET: S3_BUCKET, maxKeys: 50 });

			const imageData = images.map((item) => {
				const imagesTemp = imageMeta.find((image) => image.key === item.key);
				return { ...item, ...imagesTemp };
			});

			return new Response(JSON.stringify({ images: imageData }), { status: 200 });
		} else {
			return new Response('There has been an unexcepted error. Please try again later', {
				status: 500
			});
		}
	} else {
		return new Response('Unauthorized', { status: 401 });
	}
};
