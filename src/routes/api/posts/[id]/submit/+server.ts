import { getPostsById, setPostStatus, updatePostBody } from '$lib/server/posts';
import { authCheck } from '$lib/server/server-utilities';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { enqueueAutoModeration } from '$lib/workers/autoModeration';
import { createPostProcessor } from '$lib/server/render/rehype/pipeline';
import { renderToHTMLString } from '@tiptap/static-renderer';
import { CodeBlock } from '@tiptap/extension-code-block';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import type { JSONContent } from '@tiptap/core';

export const POST: RequestHandler = async ({ params, request }) => {
	const session = await authCheck({ request });

	// Validate authenticated User
	if (!session?.user?.id) {
		return error(401, { message: 'UNAUTHORIZED' });
	}

	// Validate RBAC
	if (session.user.role !== 'Creator' && session.user.role !== 'Admin') {
		return error(403, { message: 'ACCESS RESTRICTED' });
	}

	// Fetch Post and current Revision from DB
	const post = await getPostsById(params.id as string);

	// Check if post exists
	if (!post) {
		return error(404, { message: 'Post not found' });
	}

	// Validate post ownership
	if (post.userId !== session.user.id) {
		return error(403, { message: 'FORBIDDEN' });
	}

	// Validate post status is 'Draft' before submitting
	if (post.status !== 'DRAFT') {
		return error(409, { message: 'Post is not in a state that can be submitted' });
	}

	const rawHtml = renderToHTMLString({
		content: post.contentJson as JSONContent,
		extensions: [StarterKit, CodeBlock, Link, Image]
	});

	console.log('Raw HTML:', rawHtml);

	// Rehype Pipeline
	const processor = createPostProcessor();
	let processed: string;
	try {
		const file = await processor.process(rawHtml);
		processed = String(file.value);
	} catch (e) {
		console.log(e);
		throw error(409, {
			message: 'PreprocessingError: Failed to process HTML for styling'
		});
	}

	console.log('Processed HTML:', processed);

	try {
		const submitted = await setPostStatus(post.id, 'SUBMITTED');
		const updated = await updatePostBody(post.id, { contentHtml: processed });

		await enqueueAutoModeration(post.id, updated.currentRevision?.version || 1);
		return json(
			{
				message: 'Post status was successfully set to submitted',
				id: submitted.id,
				status: submitted.status
			},
			{ status: 200 }
		);
	} catch (e) {
		console.log(e);
		return error(409, { message: 'Post submission failed' });
	}
};
