import { z } from 'zod';

export const formSchema = z.object({
	postTitle: z.string().trim().min(2).max(200),
	slug: z.string().min(2).lowercase(),
	excerpt: z.string().min(2).max(250),
	tags: z.string().array()
});
