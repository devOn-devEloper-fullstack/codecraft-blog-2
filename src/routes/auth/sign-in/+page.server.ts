import type { PageServerLoad, Actions } from './$types.js';

import { fail, redirect } from '@sveltejs/kit';

import { superValidate, setError } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { auth } from '$lib/auth';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema))
	};
};

export const actions: Actions = {
	signIn: async (event) => {
		const form = await superValidate(event, zod4(formSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await auth.api.signInEmail({
				body: {
					email: form.data.email,
					password: form.data.password,
					callbackURL: '/auth/verification-success'
				}
			});
		} catch (error) {
			if (error instanceof APIError) {
				return setError(form, error.message || 'Signin failed');
			}
			console.log('Unexpected error during sign in', error);
			return setError(form, 'Unexpected error');
		}

		const listSessions = await auth.api.listSessions({
			headers: event.request.headers
		});

		const session = await auth.api.getSession({
			headers: event.request.headers
		});

		if (!session) {
			console.log('No session detected');
		}

		if (listSessions) console.log(listSessions);

		return redirect(302, '/me/posts');
	}
};
