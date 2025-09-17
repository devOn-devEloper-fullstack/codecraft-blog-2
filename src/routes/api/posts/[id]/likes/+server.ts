import { getPostLikeForUser, likePost, unlikePost } from "$lib/server/posts";
import { authCheck } from "$lib/server/server-utilities";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request, params }) => {
    const session = await authCheck({ request });

    if (!session) {
        return error(401, 'Unauthorized');
    }

    const { id } = params;

    if (!id || !session.user?.id) {
        return error(400, 'Missing post id or user id');
    }

    try {
        await likePost(id, session.user.id);
        return json({ message: 'Post liked successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error liking post:', err);
        return error(500, 'Internal Server Error');
    }
};

export const DELETE: RequestHandler = async ({ request, params }) => {
    const session = await authCheck({ request });

    if (!session) {
        return error(401, 'Unauthorized');
    }

    const { id } = params;

    if (!id || !session.user?.id) {
        return error(400, 'Missing post id or user id');
    }

    try {
        await unlikePost(id, session.user.id);
        return json({ message: 'Post unliked successfully' }, { status: 200 });
    } catch (err) {
        console.error('Error unliking post:', err);
        return error(500, 'Internal Server Error');
    }
}


