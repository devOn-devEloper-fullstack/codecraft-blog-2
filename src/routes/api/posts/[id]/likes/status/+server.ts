import { getPostLikeForUser } from "$lib/server/posts";
import { authCheck } from "$lib/server/server-utilities";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request, params }) => {
    const session = await authCheck({ request });

    if (!session) {
        return error(401, 'Unauthorized');
    }

    const { id } = params;

    if (!id || !session.user?.id) {
        return error(400, 'Missing post id or user id');
    }

    try {
        const like = await getPostLikeForUser(id, session.user.id);
        return json({ liked: !!like }, { status: 200 });
    } catch (err) {
        console.error('Error fetching like status:', err);
        return error(500, 'Internal Server Error');
    }
}