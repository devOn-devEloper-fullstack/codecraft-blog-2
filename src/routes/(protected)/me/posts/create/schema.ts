import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().trim().min(2).max(200),
	slug: z.string().min(2).lowercase(),
	// excerpt: z.string().min(2).max(250),
	tags: z
		.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)?$/i))
		.max(5)
		.default([]),
	contentHtml: z.string().min(1),
	contentJson: z.any()
});

export type FormSchema = typeof formSchema;
