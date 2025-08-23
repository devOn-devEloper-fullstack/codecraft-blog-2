import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addPost } from '$lib/server/posts';
import { auth } from '$lib/auth';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) throw redirect(302, '/auth/sign-in');

	return {
		form: await superValidate(zod4(formSchema))
	};
};

export const actions: Actions = {
	createPost: async ({ request }) => {
		// if (!locals.user) throw redirect(302, '/auth/sign-in');

		console.log('Server Action Initialized. ✅');
		const session = await auth.api.getSession({
			headers: request.headers
		});
		if (!session?.user) throw redirect(302, '/auth/sign-in');

		const form = await superValidate(request, zod4(formSchema));

		if (!form.valid) {
			console.log(
				'Form is not valid. Retry your submission with inputs that match the schema file.',
				'\nThe following data was submitted:',
				'\n\x1b[31mPost Title:\x1b[0m',
				form.data.title,
				'\n\x1b[31mPost Slug:\x1b[0m',
				form.data.slug,
				'\n\x1b[31mPost Tags:\x1b[0m',
				form.data.tags,
				'\n\x1b[31mPost Content:\x1b[0m',
				form.data.contentHtml
			);
			return fail(400, { form });
		}

		const postTitle = form.data.title;
		const slug = form.data.slug;
		const contentHtml = form.data.contentHtml;
		// const excerpt = form.data.excerpt;
		const tags = form.data.tags;

		if (!postTitle || !slug || !contentHtml) {
			console.log('Missing required fields ⛔');
			console.log(
				'\n\x1b[31mPost Title:\x1b[0m',
				form.data.title,
				'\n\x1b[31mPost Slug:\x1b[0m',
				form.data.slug,
				'\n\x1b[31mPost Tags:\x1b[0m',
				form.data.tags,
				'\n\x1b[31mPost Content:\x1b[0m',
				form.data.contentHtml
			);
			return fail(400, {
				message: 'Missing required fields',
				values: { postTitle, slug, tags }
			});
		}

		try {
			await addPost({
				postTitle,
				slug,
				contentHtml,
				excerpt: undefined,
				tags,
				published: false
			});
			console.log('SUCCESS ✅ POST ADDED TO DATABASE');
		} catch (error) {
			console.log('Unexpected error occurred during post creation', error);
			return setError(form, 'Unexpected error');
		}

		throw redirect(303, `/me/posts/${slug}`);
	}
};
