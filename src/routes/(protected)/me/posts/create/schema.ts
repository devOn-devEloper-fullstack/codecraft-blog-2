import { z } from 'zod';

export const formSchema = z.object({
	title: z.string().min(2),
	slug: z.string().min(2).lowercase(),
	// excerpt: z.string().min(2).max(250),
	tags: z.array(z.string()),
	contentHtml: z.string()
});

export type FormSchema = typeof formSchema;
