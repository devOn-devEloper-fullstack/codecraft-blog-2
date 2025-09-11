import { updatePostBody, setCurrentRevision, getPostsById } from '$lib/server/posts';
import { authCheck } from '$lib/server/server-utilities';
import type { RequestHandler } from '@sveltejs/kit';
import { formSchema } from './../../../(protected)/me/posts/edit/[slug]/formSchema';

export const PATCH: RequestHandler = async ({ request, params }) => {
	console.log('Request received!', request);

	const session = await authCheck({ request });

	// Checks for authorized users
	if (!session?.user?.id) {
		return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401 });
	}

	// Check post to validate user is allowed to edit post (RBAC and Post Owner validation)
	const postInput = await getPostsById(params.id as string);

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

		return new Response(JSON.stringify(createResponseBody), {
			status: 200
		});
	} catch (error) {
		console.error(
			'⛔ Unexpected error occurred while attempting to edit the provided post.',
			error
		);
		const errorResponse = {
			message: error
		};
		return new Response(JSON.stringify({ errorResponse }), { status: 500 });
	}
};
