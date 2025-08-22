import { auth } from '$lib/auth';
import { redirect, type RequestEvent } from '@sveltejs/kit';

type AuthCheckArguments = {
	request: RequestEvent['request'];
};

export async function authCheck({ request }: AuthCheckArguments) {
	const session = await auth.api.getSession({headers: request.headers});

	// Redirects user is not authenticated
	if (!session) {
		throw redirect(302, '/auth/sign-in');
	}
	return session;
}