import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, RequestEvent } from './$types';
import { commentSchema } from '$lib/schemas/comment-schema';
import type { Action } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }: RequestEvent) => {
	const response = await fetch('/api/posts');
	const posts = await response.json();

	return {
		posts,
		form: await superValidate(zod4(commentSchema))
	};
};

export const actions: Action = {
	comment: async (event) => {}
};
