import { updatePostBody, setCurrentRevision, getPostsById } from '$lib/server/posts';
import { authCheck } from '$lib/server/server-utilities';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { formSchema } from './../../../(protected)/me/posts/edit/[slug]/formSchema';


/**
 * API Endpoint to edit an existing post body
 * @param param0 - The request parameters
 * @returns A JSON response indicating the result of the operation
 */
export const PATCH: RequestHandler = async ({ request, params }) => {
	console.log('Request received!', request);

	const session = await authCheck({ request });

	// Checks for authorized users
	if (!session?.user?.id) {
		return error(401, 'UNAUTHORIZED');
		
	}

	// Check post to validate user is allowed to edit post (RBAC and Post Owner validation)
	const postInput = await getPostsById(params.id as string);

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

	// TODO: Add contentJson to WYSIWYG Editor and destructure here
	const { contentHtml } = validated.data;

	try {
		const post = await updatePostBody(params.id as string, {
			contentHtml
		});

		await setCurrentRevision(post.id, post.revisions[post.revisions.length - 1].id);

		const createResponseBody = {
			message: 'Post successfully edited and saved as a new draft.',
			post: {
				id: post.id,
				status: 'draft'
			}
		};

		return json(createResponseBody, { status: 200 });
	} catch (err) {
		console.error(
			'⛔ Unexpected error occurred while attempting to edit the provided post.',
			err
		);
		const errorResponse = {
			message: err instanceof Error ? err.message : String(err)
		};
		return error(500, errorResponse);
	}
};
