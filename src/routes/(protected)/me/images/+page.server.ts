import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`/api/images/me?page=1&limit=16`);
	const images = await response.json();

	return { images };
};
