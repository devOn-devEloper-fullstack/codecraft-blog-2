import { authCheck } from '$lib/server/server-utilities';
import { formSchema } from '$lib/schemas/post-metadata';
import { getPostsById, updatePostMetadata } from '$lib/server/posts';
import type { RequestHandler } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, params }) => {
	const session = await authCheck({ request });

	// Validate authenticated User

	if (!session?.user?.id) {
		return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401 });
	}

	const postInput = await getPostsById(params.id as string);

	// Validate RBAC and Post Ownership
	if (
		session?.user.id !== postInput?.userId &&
		(postInput?.User?.role === 'Creator' || postInput?.User?.role === 'Admin')
	) {
		return new Response(JSON.stringify({ error: 'ACCESS RESTRICTED' }), { status: 403 });
	}

	// Get JSON Payload and Validate against ZOD Schema
	const payload = await request.json();
	const validated = formSchema.safeParse(payload);

	// Returns a JSON response with 422 status code if not a valid input
	if (!validated.success) {
		return new Response(JSON.stringify({ fieldErrors: validated.error.flatten().fieldErrors }), {
			status: 422
		});
	}

	const { postTitle, slug, excerpt, tags } = validated.data;

	try {
		const updatedPost = await updatePostMetadata(params.id as string, { postTitle, slug, excerpt, tags });
		return new Response(JSON.stringify(updatedPost), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Failed to update post metadata' }), { status: 500 });
	}

};
