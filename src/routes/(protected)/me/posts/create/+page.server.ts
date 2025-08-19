import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { addPost } from '$lib/server/posts';
import { auth } from '$lib/auth';

// export const load: PageServerLoad = async ({ request }) => {
// 	const session = await auth.api.getSession({
// 		headers: request.headers
// 	});

// 	if (!session?.user) throw redirect(302, '/auth/sign-in');

// 	// if (!locals.user) throw redirect(302, '/auth/sign-in');
// 	return {};
// };

export const actions: Actions = {
	default: async ({ request }) => {
		// if (!locals.user) throw redirect(302, '/auth/sign-in');
		const session = await auth.api.getSession({
			headers: request.headers
		});

		if (!session?.user) throw redirect(302, '/auth/sign-in');

		const form = await request.formData();
		const postTitle = String(form.get('title') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const contentHtml = String(form.get('contentHtml') ?? '').trim();
		const contentJson = form.get('contentJson')
			? JSON.parse(String(form.get('contentJson')))
			: undefined;
		const excerpt = String(form.get('excerpt') ?? '') || null;
		const tags = String(form.get('tags') ?? '')
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean);
		const publish = form.get('publish') === 'on';

		if (!postTitle || !slug || !contentHtml) {
			return fail(400, {
				message: 'Missing required fields',
				values: { postTitle, slug, excerpt, tags }
			});
		}

		await addPost({
			postTitle,
			slug,
			contentHtml,
			contentJson,
			excerpt: excerpt || undefined,
			tags,
			userId: session?.user.id,
			publish
		});

		throw redirect(303, `/me/posts/${slug}`);
	}
};
