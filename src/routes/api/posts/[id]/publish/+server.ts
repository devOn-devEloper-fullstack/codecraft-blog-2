// src/routes/api/posts/[id]/publish/+server.ts
import { json, error, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createPostProcessor } from '$lib/server/render/rehype/pipeline';
import { getPostsById, publishPost, setCurrentRevision } from '$lib/server/posts';
import { authCheck } from '$lib/server/server-utilities';

/**
 * API Endpoint to publish an existing post draft
 * @param param0 - The request parameters
 * @returns A JSON response indicating the result of the operation
 */
export const POST: RequestHandler = async ({ params, request }) => {
	const session = await authCheck({ request });

	// Validate authenticated User
	if (!session?.user?.id) {
		return error(401, 'UNAUTHORIZED');
	}

	// Fetch Post and current Revision from DB
	const post = await getPostsById(params.id as string);

	// Validate RBAC and Post Ownership

	// TODO: Refactor to verify that the user session contains a role of 'Moderator' or 'Admin' (i.e., no requests to this endpoint should be from creators or users)
	if (
		session.user.id !== post?.userId &&
		(post?.User?.role !== 'Admin' && post?.User?.role !== 'User')
	) {

		return error(403, 'ACCESS RESTRICTED');
	}

	// Check if post and currentRevision exist
	if (!post?.currentRevision) return error(404, 'Post not found or missing revision');

	// TODO: Validate post status is 'Submitted' before publishing (i.e., not already published, draft, or rejected).


	// pass html content to rawHtml variable
	const rawHtml = post.currentRevision.content.replace(/ {3}/g, '\n');

	// rehype pipeline
	const processor = createPostProcessor();
	let processed: string;
	try {
		const file = await processor.process(rawHtml);
		processed = String(file.value);
	} catch (e) {
		console.log(e);
		return error(409, {
			message: 'PreprocessingError: Failed to process HTML for styling'
		});
	}

	try {
		const updated = await publishPost(post.id, processed);
		await setCurrentRevision(post.id, updated.revisions[updated.revisions.length - 1].id);
		return json({
			message: 'Post published successfully',
			id: updated.id,
			status: updated.status,
			publishedAt: updated.publishedAt,
			published: updated.published
		}, { status: 200 });
	} catch (e) {
		console.log(e);
		return error(409, {
			message: 'Post publishing failed'
		});
	}
}
