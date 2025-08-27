import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().trim().min(2).max(200),
	slug: z.string().min(2).lowercase(),
	excerpt: z.string().min(2).max(250),
	tags: z
		.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)?$/i))
		.max(5)
		.default([]),
	contentHtml: z.string().min(1),
	contentJson: z.any()
});

const MAX_FILE_SIZE = 5*1024*1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const imageUploadSchema = z.object({
	image: z.instanceof(File).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
		message: 'Only .jpg, .png, and .webp formats are supported.'
	}).refine((file) => file.size <= MAX_FILE_SIZE, {
		message: "Max image size is 5MB."
	}),
	placeholder: z.string(),
	alt: z.string(),
	caption: z.string(),
})

export type FormSchema = typeof formSchema;
export type imageUploadSchema = typeof imageUploadSchema
