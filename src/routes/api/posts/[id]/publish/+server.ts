// src/routes/api/posts/[id]/publish/+server.ts
import { json, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createPostProcessor } from '$lib/server/render/rehype/pipeline';
import { publishPost, setCurrentRevision } from '$lib/server/posts';

export async function POST({ params }) {
	const post = await prisma.posts.findUnique({
		where: { id: params.id },
		include: { currentRevision: true }
	});
	if (!post?.currentRevision) throw error(404, 'Post not found or missing revision');
	// RBAC & moderation checks here…

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
		throw error(409, {
			message: 'PreprocessingError: Failed to process HTML for styling'
		});
	}

	const updated = await publishPost(post.id, processed);

	const currentRevision = await setCurrentRevision(post.id, updated.revisions[updated.revisions.length - 1].id);

	return json({ id: updated.id, status: updated.status, publishedAt: updated.publishedAt });
}
