import { setModerationDecision } from "$lib/server/moderate";
import { authCheck } from "$lib/server/server-utilities";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const session = await authCheck({ request })
    
    
    if (!session?.user?.id) {
        return  error(401, 'Unauthorized');
    }

    if (session.user?.role !== 'Moderator' && session.user?.role !== 'Admin') {
        return error(403, 'Forbidden');
    }
    const { taskId, status, rationale } = await request.json();

    if (!taskId || !status || !rationale) {
        return error(422, 'Missing required fields');
    }

    try {
        const decision = await setModerationDecision(
            taskId,
            status,
            rationale,
            session.user.id
        );

        return json({ message: 'Decision recorded', decision }, { status: 200 });

    } catch (e) {
        console.log(e);
        return error(500, 'Internal Server Error');
    }


}