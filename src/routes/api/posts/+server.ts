import { authCheck } from '$lib/server/server-utilities';
import type { RequestHandler } from './$types';
import { formSchema } from './../../(protected)/me/posts/create/schema';
import { slugUnique } from '$lib/server/server-utilities';
import { addPost, getAllPublishedPosts, setCurrentRevision } from '$lib/server/posts';
import { error, json } from '@sveltejs/kit';

/**
 * API Endpoint to create a new post draft
 * Expects a JSON payload matching the formSchema
 * Validates user authentication and slug uniqueness
 * On success, creates a new post and returns its ID and slug
 * On failure, returns appropriate HTTP error codes and messages
 */
export const POST: RequestHandler = async ({ request, setHeaders }) => {
	const session = await authCheck({ request });

	// Checks for authorized users
	if (!session?.user?.id) {
		return error(401, 'UNAUTHORIZED');
	}

	// RBAC - Only Admins and Authors can create posts
	if (session.user.role !== 'Admin' && session.user.role !== 'Creator') {
		return error(403, 'FORBIDDEN');
	}

	// Get JSON Payload and Validate against ZOD Schema
	const payload = await request.json();
	const validated = formSchema.safeParse(payload);

	// Returns a JSON response with 422 status code if not a valid input
	if (!validated.success) {
		return error(422, JSON.stringify({ fieldErrors: validated.error.flatten().fieldErrors }));
	}

	// TODO: Add contentJson to WYSIWYG Editor and destructure here
	const { title, slug, excerpt, tags, contentHtml, contentJson } = validated.data;

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

		return error(409, errorResponse);
	}

	// Add post to database using addPost function. Catching any errors in the database add.
	try {
		const post = await addPost({
			postTitle: title,
			slug,
			contentHtml,
			excerpt,
			tags,
			contentJson: JSON.parse(contentJson),
			published: false,
			userId: session?.user.id
		});

		await setCurrentRevision(post.id, post.revisions[post.revisions.length - 1].id);

		const createPostResponseBody = {
			message: 'New post draft successfully saved',
			post: {
				id: post.id,
				slug: slug,
				status: 'draft'
			}
		};

		setHeaders({ Location: `localhost:5173/me/edit/${post.id}` });

		return json(createPostResponseBody, {
			status: 201,
			headers: { Location: `localhost:5173/me/edit/${post.id}` }
		});
	} catch (err) {
		console.error('Unexpected error occurred during post creation', err);
		const errorMessage = err instanceof Error ? err.message : String(err);
		const errorResponse = {
			message: errorMessage
		};

		return error(500, errorResponse);
	}
};

/**
 * API Endpoint to handle GET requests for posts
 */

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') ?? '10');
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const start = (page - 1) * limit;

	try {
		const posts = await getAllPublishedPosts(1000);
		const paginatedPosts = posts.slice(start, start + limit);

		return json(
			{
				page,
				limit,
				total: posts.length,
				posts: paginatedPosts
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error('Error fetching posts:', err);
		return error(500, 'Internal Server Error');
	}
};
