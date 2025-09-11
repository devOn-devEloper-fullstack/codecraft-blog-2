import { setModerationDecision } from "$lib/server/moderate";
import { authCheck } from "$lib/server/server-utilities";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { formSchema } from "$lib/schemas/decision-schema";;

export const POST: RequestHandler = async ({ request }) => {
    const session = await authCheck({ request })
    
    
    if (!session?.user?.id) {
        return  error(401, 'Unauthorized');
    }

    if (session.user?.role !== 'Moderator' && session.user?.role !== 'Admin') {
        return error(403, 'Forbidden');
    }
    const payload = await request.json();
    const validated = formSchema.safeParse(payload);

    if (!validated.success) {
        return error(422, JSON.stringify({message: "Invalid input", data: validated.error.flatten().fieldErrors}));

    }
    const { taskId, status, rationale } = validated.data;
    

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