import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, RequestEvent } from './$types';
import { commentSchema } from '$lib/schemas/comment-schema';
import { redirect, fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/auth';
import { authCheck } from '$lib/server/server-utilities';


export const load: PageServerLoad = async ({ fetch, request }: RequestEvent) => {
	const response = await fetch('/api/posts');
	const posts = await response.json();

	return {
		posts,
		form: await superValidate(zod4(commentSchema)),
		session: await auth.api.getSession(request)
	};
};

export const actions: Actions = {
	addComment: async ({ request, fetch }) => {

		console.log('=== Server Action Triggered: addComment ===\n');
		const session = await authCheck({ request });
		if (!session) throw redirect(302, '/auth/sign-in');

		const form = await superValidate(request, zod4(commentSchema));

		if (!form.valid) {
			console.log('Form is not valid.');
			console.log(`\nForm Output: ${JSON.stringify(form.data)}`);
			return fail(400, { form })
		}

		console.log('Validating form data...')

		const { comment, postId } = form.data;

		try {
			console.log('Submitting comment to API endpoint...')
			const res = await fetch(`/api/posts/${postId}/comments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ comment, postId })
			});
		} catch (error) {
			return fail(500, { error: 'Failed to post comment' });
		}
	},
};
