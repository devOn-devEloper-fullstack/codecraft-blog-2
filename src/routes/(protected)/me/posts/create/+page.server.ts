import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addPost } from '$lib/server/posts';
import { auth } from '$lib/auth';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { s3, S3_BUCKET } from '$lib/server/s3';
import { env } from '$env/dynamic/private';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import crypto from 'node:crypto';
import { createImagesBulk, type NewImage } from '$lib/server/images';
import { authCheck } from '$lib/server/server-utilities';

function sanitizeFileName(name: string) {
	return name.replace(/[^\w\-.]+/g, '_');
}
function isAllowedMime(type: string) {
	return /^image\//.test(type);
}

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session?.user) throw redirect(302, '/auth/sign-in');

	return {
		form: await superValidate(zod4(formSchema))
	};
};

export const actions: Actions = {
	createPost: async ({ request }) => {
		/**
		 * createPost: A server action that takes a request from the post creation form and creates a blog post
		 */
		console.log('Server Action Initialized. ✅');

		// Check for a valid user session:
		const session = await authCheck({ request });
		if (!session?.user) throw redirect(302, '/auth/sign-in');

		// Get and validate form data:
		const form = await superValidate(request, zod4(formSchema));

		if (!form.valid) {
			console.log(
				'Form is not valid. Retry your submission with inputs that match the schema file.',
				'\nThe following data was submitted:',
				'\n\x1b[31mPost Title:\x1b[0m',
				form.data.title,
				'\n\x1b[31mPost Slug:\x1b[0m',
				form.data.slug,
				'\n\x1b[31mPost Tags:\x1b[0m',
				form.data.tags,
				'\n\x1b[31mPost Content:\x1b[0m',
				form.data.contentHtml
			);
			return fail(400, { form });
		}

		// const postTitle = form.data.title;
		// const slug = form.data.slug;
		// const contentHtml = form.data.contentHtml;
		// const excerpt = form.data.excerpt;
		// const tags = form.data.tags;

		const { title, slug, contentHtml, excerpt, tags } = form.data;

		if (!title || !slug || !contentHtml) {
			console.log('Missing required fields ⛔');
			console.log(
				'\n\x1b[31mPost Title:\x1b[0m',
				form.data.title,
				'\n\x1b[31mPost Slug:\x1b[0m',
				form.data.slug,
				'\n\x1b[31mPost Tags:\x1b[0m',
				form.data.tags,
				'\n\x1b[31mPost Content:\x1b[0m',
				form.data.contentHtml
			);
			return fail(400, {
				message: 'Missing required fields',
				values: { title, slug, tags }
			});
		}

		try {
			await addPost({
				postTitle: title,
				slug,
				contentHtml,
				excerpt: excerpt,
				tags,
				published: false,
				userId: session?.user.id
			});
			console.log('SUCCESS ✅ POST ADDED TO DATABASE');
		} catch (error) {
			console.log('Unexpected error occurred during post creation', error);
			return setError(form, 'Unexpected error');
		}

		throw redirect(303, `/me/posts/${slug}`);
	},
	uploadImage: async ({ request, locals }) => {
		const session = await auth.api.getSession({
			headers: request.headers
		});
		if (!session) throw error(401, 'Unauthorized');

		const form = await request.formData();
		console.log('Form Data:', form);
		const alt = (form.get('alt') as string | null)?.slice(0, 500) ?? null;
		const caption = (form.get('caption') as string | null)?.slice(0, 1000) ?? null;

		const files = form.getAll('files') as File[];
		if (!files.length) return fail(400, { error: 'Please attach at least one image.' });

		const MAX_FILES = 10;
		const MAX_BYTES = 20 * 1024 * 1024; // 20MB per file
		if (files.length > MAX_FILES) return fail(400, { error: `Too many files (max ${MAX_FILES}).` });

		const uploaded: { key: string; encodedKey: string }[] = [];
		const region = env.S3_REGION!;
		const bucket = S3_BUCKET;

		// Collect DB rows, then write in a single transaction
		const toCreate: NewImage[] = [];

		for (const f of files) {
			const sizebytes = f.size ?? 0;
			const mimetype = f.type ?? 'application/octet-stream';
			if (sizebytes === 0) return fail(400, { error: `File "${f.name}" is empty.` });
			if (sizebytes > MAX_BYTES)
				return fail(400, { error: `File "${f.name}" exceeds ${MAX_BYTES / (1024 * 1024)}MB.` });
			if (!isAllowedMime(mimetype))
				return fail(400, { error: `File "${f.name}" is not an image.` });

			const ab = await f.arrayBuffer();
			const buffer = Buffer.from(ab);

			const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

			let width: number | null = null;
			let height: number | null = null;
			try {
				const meta = await sharp(buffer).metadata();
				width = meta.width ?? null;
				height = meta.height ?? null;
			} catch {
				return fail(400, { error: `Could not read image metadata for "${f.name}".` });
			}

			let placeholder: string | null = null;
			try {
				const tiny = await sharp(buffer).resize({ width: 16 }).jpeg({ quality: 40 }).toBuffer();
				placeholder = `data:image/jpeg;base64,${tiny.toString('base64')}`;
			} catch {
				placeholder = null;
			}

			const safeName = sanitizeFileName(f.name || 'image');
			const key = `${locals.user.id}/${crypto.randomUUID()}-${safeName}`;

			let etag: string | null = null;
			try {
				const uploader = new Upload({
					client: s3,
					params: {
						Bucket: bucket,
						Key: key,
						Body: buffer,
						ContentType: mimetype,
						ContentLength: sizebytes
					}
				});
				const res = await uploader.done();
				const anyRes = res as unknown as { ETag?: string };
				etag = anyRes.ETag ?? null;
				if (etag && etag.startsWith('"') && etag.endsWith('"')) etag = etag.slice(1, -1);
			} catch (e) {
				console.error('S3 upload failed', e);
				return fail(500, { error: `Failed to upload "${f.name}".` });
			}

			// Push to bulk insert array
			toCreate.push({
				userId: session?.user.id,
				bucket,
				region,
				key,
				etag,
				checksum,
				mimetype,
				sizebytes,
				width,
				height,
				placeholder,
				alt,
				caption
			});

			uploaded.push({ key, encodedKey: encodeURIComponent(key) });
		}

		// ⬇️ Single transaction write to DB
		try {
			await createImagesBulk(toCreate);
		} catch (e) {
			console.error('DB insert failed', e);
			return fail(500, { error: `Failed to record uploaded images in database.` });
		}

		return { success: { count: uploaded.length, items: uploaded } };
	}
};
