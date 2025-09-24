import { error, json, type RequestHandler } from "@sveltejs/kit";
import superValidate from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { commentSchema } from "$lib/schemas/comment-schema";
import { authCheck } from "$lib/server/server-utilities";
import { addCommentToPost } from "$lib/server/posts";

export const POST: RequestHandler = async ({ params, request }) => {
    const session = await authCheck({ request });

    if (!session) {
        return error(401, 'Unauthorized');
    }
    
    const postIdParam = params.id;

    const payload = await request.json();
    const validated = commentSchema.safeParse(payload);

    if (!validated.success) {
        return error(422, JSON.stringify({ fieldErrors: validated.error.flatten().fieldErrors }));
    }

    if (postIdParam !== validated.data.postId) {
        return error(400, 'Post ID mismatch');
    }

    const { comment, postId } = validated.data

    try {
        const newComment = await addCommentToPost(postId, session.user.id, comment);
        return newComment ? json({ message: 'Comment added successfully', comment: newComment }, { status: 201 }) : error(500, 'Failed to add comment');
    } catch (err) {
        return error(500, 'Failed to add comment');
    }



};