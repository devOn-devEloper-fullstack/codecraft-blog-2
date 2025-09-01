import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().trim().min(2).max(200),
	slug: z.string().min(2).lowercase(),
	excerpt: z.string().min(2).max(250),
	tags: z.string().array(),
	contentHtml: z.string().min(1),
	contentJson: z.any()
});

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const imageUploadSchema = z.object({
	image: z
		.instanceof(File)
		.refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
			message: 'Incorrect file type. Acceptable types include .jpeg, .png, and .webp'
		})
		.refine((file) => file.size <= MAX_FILE_SIZE, {
			message: 'File size must not exceed 20MB'
		}),
	placeholder: z.string(),
	alt: z.string().min(2).max(500),
	caption: z.string().min(2).max(1000)
});

export type FormSchema = typeof formSchema;
export type imageUploadSchema = typeof imageUploadSchema;
