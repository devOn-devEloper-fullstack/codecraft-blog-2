import { z } from 'zod';

export const formSchema = z.object({
	contentHtml: z.string().min(1),
	contentJson: z.any()
});
