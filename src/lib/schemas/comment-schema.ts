import { z } from 'zod';

export const commentSchema = z.object({
	comment: z.string().min(1).max(1000)
});
export type CommentSchema = z.infer<typeof commentSchema>;
