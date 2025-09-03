// src/routes/api/posts/[id]/publish/+server.ts
import { json, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { createPostProcessor } from '$lib/server/render/rehype/pipeline';

export async function POST({ params }) {
	const post = await prisma.posts.findUnique({
		where: { id: params.id },
		include: { currentRevision: true }
	});
	if (!post?.currentRevision) throw error(404, 'Post not found or missing revision');
	// RBAC & moderation checks here…

	// // Render Tiptap JSON → HTML
	// const rawHtml = await renderTiptapToHtml(post.currentRevision.content);

	// pass html content to rawHtml variable

	// rehype pipeline
	const processor = createPostProcessor();
	let processed: string;
	try {
		const file = await processor.process(rawHtml);
		processed = String(file.value);
	} catch (e) {
		throw error(409, {
			message: 'PreprocessingError',
			detail: 'Failed to process HTML for styling'
		});
	}

	const updated = await prisma.posts.update({
		where: { id: post.id },
		data: {
			contentHtml: processed,
			status: 'PUBLISHED',
			publishedAt: new Date()
		}
	});

	return json({ id: updated.id, status: updated.status, publishedAt: updated.publishedAt });
}
