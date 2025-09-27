import { totalLikesAnalytics, totalLikesByDate } from "$lib/server/analytics";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async () => {
    const likes = await totalLikesAnalytics();
    const likesByDate = await totalLikesByDate();

    console.log(likesByDate)

    return {
        likes,
        likesByDate
    }
}