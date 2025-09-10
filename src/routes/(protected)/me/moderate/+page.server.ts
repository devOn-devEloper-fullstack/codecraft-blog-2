import { getClaimedTasks, getModerationTasks } from "$lib/server/moderate";
import { error, redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ locals }) => {
    if (!locals.session) {
        throw redirect(303, '/auth/sign-in');
    }

    if (locals.user?.role !== 'Moderator' && locals.user?.role !== 'Admin') {
        throw error(403, 'You do not have permission to access this page.');
    }
    
    const tasks = await getModerationTasks();
    const claimed = await getClaimedTasks(locals.user.id);


    return {
        tasks,
        claimed
    };
}

