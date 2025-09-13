import { authCheck } from '$lib/server/server-utilities';
import { formSchema } from '$lib/schemas/post-metadata';
import { getPostsById, updatePostMetadata } from '$lib/server/posts';
import { error, json, type RequestHandler } from '@sveltejs/kit';


/**
 * API Endpoint to edit an existing post's metadata
 * @param param0 - The request parameters
 * @returns A JSON response indicating the result of the operation
 */
export const PATCH: RequestHandler = async ({ request, params }) => {
	const session = await authCheck({ request });

	// Validate authenticated User

	if (!session?.user?.id) {
		return error(401, 'UNAUTHORIZED');
	}

	const postInput = await getPostsById(params.id as string);

	// Validate RBAC and Post Ownership
	if (
		session?.user.id !== postInput?.userId &&
		(postInput?.User?.role === 'Creator' || postInput?.User?.role === 'Admin')
	) {
		return error(403, 'ACCESS RESTRICTED');
	}

	// Verify status is set to draft before allowing edit
	if (postInput?.status !== 'DRAFT') {
		return error(403, 'ONLY DRAFT POSTS CAN BE EDITED');
	}

	// Get JSON Payload and Validate against ZOD Schema
	const payload = await request.json();
	const validated = formSchema.safeParse(payload);

	// Returns a JSON response with 422 status code if not a valid input
	if (!validated.success) {
		return error(422, JSON.stringify({ fieldErrors: validated.error.flatten().fieldErrors }));
	}

	const { postTitle, slug, excerpt, tags } = validated.data;

	try {
		const updatedPost = await updatePostMetadata(params.id as string, { postTitle, slug, excerpt, tags });
		return json(updatedPost, { status: 200 });
	} catch (err) {
		console.error('⛔ Unexpected error occurred while attempting to update post metadata.', err);
		return error(500, 'Failed to update post metadata');
	}

};
