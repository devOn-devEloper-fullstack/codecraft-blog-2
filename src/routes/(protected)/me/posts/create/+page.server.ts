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
	default: async ({ request }) => {
		// if (!locals.user) throw redirect(302, '/auth/sign-in');
		const session = await auth.api.getSession({
			headers: request.headers
		});
		if (!session?.user) throw redirect(302, '/auth/sign-in');

		const form = await superValidate(request, zod4(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const postTitle = form.data.title;
		const slug = form.data.slug;
		const contentHtml = form.data.contentHtml;
		const contentJson = form.data.contentJson
			? JSON.parse(String(form.data.contentJson))
			: undefined;
		const excerpt = form.data.excerpt;
		const tags = form.data.tags;

		if (!postTitle || !slug || !contentHtml) {
			return fail(400, {
				message: 'Missing required fields',
				values: { postTitle, slug, excerpt, tags }
			});
		}

		try {
			await addPost({
				postTitle,
				slug,
				contentHtml,
				contentJson,
				excerpt: excerpt || undefined,
				tags,
				published: false
			});
		} catch (error) {
			console.log('Unexpected error occurred during post creation', error);
			return setError(form, 'Unexpected error');
		}

		throw redirect(303, `/me/posts/${slug}`);
	}
};
