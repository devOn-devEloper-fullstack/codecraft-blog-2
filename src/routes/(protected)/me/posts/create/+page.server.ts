import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { addPost } from '$lib/server/posts';
import { auth } from '$lib/auth';
import { superValidate, setError, message } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema, imageUploadSchema } from './schema';
import { s3, S3_BUCKET, encodeKey } from '$lib/server/s3';
import { env } from '$env/dynamic/private';
import { Upload } from '@aws-sdk/lib-storage';
import sharp from 'sharp';
import crypto from 'node:crypto';
import { createImage, type NewImage, listImagesForKeys } from '$lib/server/images';
import { authCheck, slugUnique } from '$lib/server/server-utilities';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

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

	const accessS3 = new ListObjectsV2Command({
		Bucket: S3_BUCKET,
		Prefix: `image-gallery/${session.user.id}`,
		MaxKeys: 100
	});

	const imageObjects = await s3.send(accessS3);
	const items = (imageObjects.Contents ?? [])
		.filter((obj) => !!obj.Key)
		.map((obj) => {
			const key = obj.Key!;
			return {
				key,
				// App-level URL that hides S3 and will mint a presigned URL at request time
				url: `/img/${encodeKey(key)}`
			};
		});
	const keys: Array<string> = [];
	items.forEach((item) => keys.push(item.key));

	const imageGalleryDB = await listImagesForKeys(keys);

	const itemDB = items.map((item) => {
		const images = imageGalleryDB.find((image) => image.key === item.key);
		return { ...item, ...images };
	});

	return {
		form: await superValidate(zod4(formSchema)),
		imageForm: await superValidate(zod4(imageUploadSchema)),
		itemDB
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
				form.data.contentHtml,
				'These are the following errors that were detected in the submission:',
				form.errors
			);
			return fail(400, { form });
		}

		// Destructure form data to access submission data from user:
		const { title, slug, contentHtml, excerpt, tags } = form.data;

		// Review non-null fields for truthiness
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

		// Verify uniqueness of slug value:
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
			return fail(409, errorResponse);
		}

		// Attempt database record creation
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

		// Redirect to the newly created post
		throw redirect(303, `/me/posts/edit/${slug}`);
	},
	uploadImage: async ({ request }) => {
		/**
		 * uploadImage: A server action that accepts a request from the image upload form and adds the image(s) to S3 and database.
		 */
		console.log('Server Action Initialized. ✅');

		// Check for a valid user session:
		const session = await authCheck({ request });
		if (!session) throw error(401, 'Unauthorized');

		// Get and validate form data:
		const form = await superValidate(request, zod4(imageUploadSchema));

		if (!form.valid) {
			console.log(
				'Form is not valid. Retry your submission with inputs that match the schema file.',
				'\nThe following data was submitted:',
				'\n\x1b[31mImage File:\x1b[0m',
				form.data.image,
				'\n\x1b[31mPlaceholder:\x1b[0m',
				form.data.placeholder,
				'\n\x1b[31mAlternative Text:\x1b[0m',
				form.data.alt,
				'\n\x1b[31mCaption:\x1b[0m',
				form.data.caption,
				'\nForm Errors:',
				form.errors
			);
			return fail(400, { form });
		}

		const { image, placeholder, alt, caption } = form.data;

		const MAX_BYTES = 20 * 1024 * 1024; // 20MB per file

		// S3 Parameters
		const region = env.S3_REGION!;
		const bucket = S3_BUCKET;

		// Image Metadata
		const sizeBytes = image.size ?? 0;
		const mimeType = image.type ?? 'application/octet-stream';

		// Image size validation
		if (sizeBytes === 0) {
			return fail(400, { error: `File "${image.name}" is empty.` });
		}

		if (sizeBytes > MAX_BYTES) {
			return fail(400, { error: `File "${image.name}" exceeds ${MAX_BYTES / (1024 * 1024)} MB.` });
		}

		// Image type validation

		if (!isAllowedMime(mimeType)) {
			return fail(400, { error: `File "${image.name}" is not an image.` });
		}

		// Buffers and ArrayBuffers for image processing
		const ab = await image.arrayBuffer();
		const buffer = Buffer.from(ab);

		// Algorithm for checksum (i.e., data integrity and file corruption validation)
		const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

		let width: number | null = null;
		let height: number | null = null;

		try {
			const meta = await sharp(buffer).metadata();
			width = meta.width ?? null;
			height = meta.height ?? null;
		} catch {
			return fail(400, { error: `Could not read image metadata for "${image.name}".` });
		}

		const safeName = sanitizeFileName(image.name || 'image');
		const key = `image-gallery/${session.user?.id}/${crypto.randomUUID()}-${safeName}`;

		let etag: string | null = null;

		try {
			const uploader = new Upload({
				client: s3,
				params: {
					Bucket: bucket,
					Key: key,
					Body: buffer,
					ContentType: mimeType,
					ContentLength: sizeBytes
				}
			});
			const res = await uploader.done();
			const anyRes = res as unknown as { ETag?: string };
			etag = anyRes.ETag ?? null;
			if (etag && etag.startsWith('"') && etag.endsWith('"')) etag = etag.slice(1, -1);
		} catch (e) {
			console.error('⛔ S3 upload failed. ⛔', e);
			return fail(500, { error: `Failed to upload "${image.name}".` });
		}

		// Push to bulk insert array
		const toCreate: NewImage = {
			userId: session?.user.id,
			bucket,
			region,
			key,
			url: `/img/${encodeKey(key)}`,
			etag,
			checksum,
			mimeType,
			sizeBytes,
			width,
			height,
			placeholder,
			alt,
			caption,
			postId: null,
			indexInHtml: null
		};

		const uploaded = { key, encodedKey: encodeURIComponent(key) };

		try {
			await createImage(toCreate);
			return message(form, {
				status: 'success'
			});
		} catch (e) {
			console.error('⛔ DB insert failed ⛔', e);
			return fail(500, { error: `Failed to record uploaded images in database.` });
		}

		return { form: { success: { count: 1, items: uploaded } } };
	}
};
