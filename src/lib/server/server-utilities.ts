import { auth } from '$lib/auth';
import type { RequestEvent } from './$types';
export async function authCheck({ request: RequestEvent }) {
	const a = await auth.api.getSession();
}
