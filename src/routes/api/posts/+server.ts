import { authCheck } from '$lib/server/server-utilities';
import type { RequestHandler } from './$types';
import { formSchema } from './../../(protected)/me/posts/create/schema';
import { slugUnique } from '$lib/server/server-utilities';
import { addPost } from '$lib/server/posts';

export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const session = await authCheck({ request });

	// Checks for authorized users
	if (!session?.user?.id) {
		return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401 });
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
	const { title, slug, tags, contentHtml } = validated.data;

	// Validate slug is unique
	const slugUniqueCheck = await slugUnique(slug);

	if (!slugUniqueCheck) {
		const errorResponse = {
			error: 'CONFLICT',
			message: 'Slug already exists.',
			conflict: {
				field: 'slug',
				value: slug
			}
		};
		return new Response(JSON.stringify({ errorResponse }), { status: 409 });
	}

	// Add post to database using addPost function. Catching any errors in the database add.
	try {
		const post = await addPost({
			postTitle: title,
			slug,
			contentHtml,
			excerpt: undefined,
			tags,
			published: false,
			userId: session?.user.id
		});

		const createPostResponseBody = {
			message: 'New post draft successfully saved',
			post: {
				id: post.id,
				slug: slug,
				status: 'draft'
			}
		};

		setHeaders({ Location: `localhost:5173/me/edit/${post.id}` });
		const createPostResponse = new Response(JSON.stringify(createPostResponseBody), {
			status: 201
		});
		return createPostResponse;
	} catch (error) {
		console.log('Unexpected error occurred during post creation', error);
		const errorResponse = {
			message: error
		};
		return new Response(JSON.stringify({ errorResponse }), { status: 500 });
	}
};
