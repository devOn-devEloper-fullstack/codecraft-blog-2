import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, RequestEvent } from './$types';
import { commentSchema } from '$lib/schemas/comment-schema';
import type { Action } from '@sveltejs/kit';
import { auth } from '$lib/auth';

export const load: PageServerLoad = async ({ fetch, request }: RequestEvent) => {
	const response = await fetch('/api/posts');
	const posts = await response.json();

	return {
		posts,
		form: await superValidate(zod4(commentSchema)),
		session: await auth.api.getSession(request)
	};
};

export const actions: Action = {
	comment: async (event) => {}
};
