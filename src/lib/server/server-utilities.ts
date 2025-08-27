import { auth } from '$lib/auth';
import { redirect, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

type AuthCheckArguments = {
	request: RequestEvent['request'];
};

type serverDebugArguments<T = string> = Record<string, T>

export async function authCheck({ request }: AuthCheckArguments) {
	const session = await auth.api.getSession({ headers: request.headers });

	// Redirects user is not authenticated
	// if (!session) {
	// 	throw redirect(302, '/auth/sign-in');
	// }
	return session;
}

export async function slugUnique(slug: string) {
	const dbCheck = await prisma.posts.count({
		where: {
			slug: slug
		}
	});

	const uniqueFlag = dbCheck === 0 ? true : false;

	return uniqueFlag;
}
