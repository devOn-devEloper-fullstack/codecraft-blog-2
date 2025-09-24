import { z } from 'zod';

export const commentSchema = z.object({
	comment: z.string().min(1).max(1000),
	postId: z.string().uuid()
});
export type CommentSchema = z.infer<typeof commentSchema>;
