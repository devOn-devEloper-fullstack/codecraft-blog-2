import type { PageServerLoad, RequestEvent } from './$types';

export const load: PageServerLoad = async ({ fetch }: RequestEvent) => {
	const response = await fetch('/api/posts');
	const posts = await response.json();

	return {
		posts
	};
};
