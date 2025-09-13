import { getPostsById, setPostStatus } from "$lib/server/posts";
import { authCheck } from "$lib/server/server-utilities";
import { error, json, type RequestHandler } from "@sveltejs/kit";


/**
 * API Endpoint to reject an existing post
 * @param param0 - The request parameters
 * @returns A JSON response indicating the result of the operation
 */
export const POST: RequestHandler = async ({ params, request }) => {
    const session = await authCheck({ request });

    // Validate authenticated user
    if (!session?.user?.id) {
        return error(401, { message: "UNAUTHORIZED" });
    }

    // Fetch Post from DB
    const post = await getPostsById(params.id as string);

    // Validate RBAC and Post Ownership
    if (session?.user?.role !== 'Moderator') {
        return error(403, { message: "ACCESS RESTRICTED" });
    }

    // Check if post exists
    if (!post) {
        return error(404, { message: "Post not found" });
    }

    // Validate post status is 'Submitted' before rejecting
    if (post.status !== 'SUBMITTED') {
        return error(409, { message: "Post is not in a state that can be rejected" });
    }

    try {
        const rejected = await setPostStatus(post.id, 'REJECTED');
        return json({
            message: "Post was succesfully rejected",
            id: rejected.id,
            status: rejected.status,
        }, { status: 200 });
    } catch (e) {
        console.log(e);
        return error(409, { message: "Post rejection failed" });
    }

};