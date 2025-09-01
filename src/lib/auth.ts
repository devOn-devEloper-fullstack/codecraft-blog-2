import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '$lib/server/email';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

const prisma = new PrismaClient();
export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql'
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		/* eslint-disable-next-line */
		sendResetPassword: async ({ user, url, token }, request) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the following link to reset your password: ${url}`
			});
		},
		/* eslint-disable-next-line */
		onPasswordReset: async ({ user }, request) => {
			// your logic here
			console.log(`Password for user ${user.email} has been reset.`);
		}
	},
	emailVerification: {
		/* eslint-disable-next-line */
		sendVerificationEmail: async ({ user, url, token }, request) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				text: `Click the following link to verify your email address: ${url}`
			});
		},
		/* eslint-disable-next-line */
		afterEmailVerification: async (user, request) => {
			console.log(`${user.email} has been sucessfully verified`);
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true
	},
	advanced: {
		database: {
			generateId: false
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
