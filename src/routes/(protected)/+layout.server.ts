import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) throw redirect(302, '/auth/sign-in');

	return { session };
};
