// sendEmail.ts
// Lightweight email utility for a Node.js server using SMTP (via Nodemailer)
//
// ✅ API: sendEmail({ to, subject, text })
// - `to`: string or string[] — recipient(s)
// - `subject`: string — subject line
// - `text`: string — plain-text body
//
// 🔧 Configuration via environment variables:
// - SMTP_HOST: SMTP server hostname (e.g., smtp.gmail.com)
// - SMTP_PORT: SMTP port (465 for SSL, 587 for STARTTLS)
// - SMTP_USER: SMTP username
// - SMTP_PASS: SMTP password
// - SMTP_SECURE: "true" to enforce SSL (usually with port 465)
// - MAIL_FROM: default From address (e.g., "Example <no-reply@example.com>")
//
// Install: npm i nodemailer && npm i -D @types/nodemailer typescript
// Usage (ESM):
//   import { sendEmail } from './sendEmail.js'; // after TS build emits .js
//   await sendEmail({ to: 'user@example.com', subject: 'Hi', text: 'Hello world' });
//
// Suggested tsconfig.json excerpt for ESM targets:
// {
//   "compilerOptions": {
//     "target": "ES2022",
//     "module": "ES2022",
//     "moduleResolution": "Bundler",
//     "strict": true,
//     "outDir": "dist",
//     "esModuleInterop": true,
//     "forceConsistentCasingInFileNames": true
//   },
//   "include": ["./**/*.ts"]
// }

import nodemailer, { type SentMessageInfo, type Transporter } from 'nodemailer';

/** Runtime check and type predicate for non-empty strings */
function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

/** Options for sendEmail */
export interface SendEmailOptions {
	to: string | string[];
	subject: string;
	text: string;
}

/**
 * Read and validate required SMTP env vars.
 */
function readSmtpConfig() {
	const host = process.env.SMTP_HOST;
	const portRaw = process.env.SMTP_PORT;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	const secureEnv = process.env.SMTP_SECURE;

	const currentDate = new Date();

	console.log(
		`⚠️ [${currentDate.toString()}] DEBUG: SMTP_HOST=${host}, SMTP_PORT=${portRaw}, SMTP_USER=${user}, SMTP_PASS=${pass}, and SMTP_SECURE=${secureEnv}`
	);

	const port = Number(portRaw ?? 587);
	const secure = secureEnv?.toLowerCase() === 'true' || port === 465;

	if (!host || !user || !pass) {
		throw new Error(
			'SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally SMTP_SECURE, MAIL_FROM).'
		);
	}

	return { host, port, user, pass, secure };
}

/** Cached transporter to avoid reconnect overhead in server contexts. */
let transporterPromise: Promise<Transporter> | undefined;
async function getTransporter(): Promise<Transporter> {
	if (!transporterPromise) {
		const { host, port, user, pass, secure } = readSmtpConfig();

		const create = () =>
			nodemailer.createTransport({
				host,
				port,
				secure,
				auth: { user, pass },
				connectionTimeout: 10000,
				greetingTimeout: 10000,
				socketTimeout: 20000,
				// force STARTTLS when not using 465
				requireTLS: !secure,
				// steadier TLS defaults + correct SNI
				tls: { minVersion: 'TLSv1.2', servername: host },
				// turn on wire logs temporarily
				logger: true,
				debug: true
			});

		// Verify once up front so subsequent sends fail fast with a clear message.
		transporterPromise = create()
			.verify()
			.then(() => create());
	}
	return transporterPromise;
}

/**
 * Send an email using SMTP.
 * @returns Nodemailer response with messageId, accepted, rejected, response, etc.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
	if (!options || typeof options !== 'object') {
		throw new TypeError('sendEmail requires an options object.');
	}

	const { to, subject, text } = options;

	// Validate inputs
	const toField = Array.isArray(to) ? to.filter(isNonEmptyString) : to;
	const toFieldValid = isNonEmptyString(toField) || (Array.isArray(toField) && toField.length > 0);
	if (!toFieldValid) {
		throw new TypeError('`to` must be a non-empty string or an array of non-empty strings.');
	}
	if (!isNonEmptyString(subject)) {
		throw new TypeError('`subject` must be a non-empty string.');
	}
	if (!isNonEmptyString(text)) {
		throw new TypeError('`text` must be a non-empty string.');
	}

	const transporter = await getTransporter();

	const from = process.env.MAIL_FROM || process.env.SMTP_USER;
	if (!from) {
		throw new Error('MAIL_FROM or SMTP_USER must be set to determine the From address.');
	}

	try {
		const info = await transporter.sendMail({
			from,
			to: toField as string | string[],
			subject,
			text
		});
		return info;
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		const e = new Error(`Failed to send email: ${msg}`);
		e.cause = err as unknown;
		throw e;
	}
}

// Optional: quick CLI usage for manual testing (after build)
// Build: tsc
// Run: node --env-file=.env dist/sendEmail.js \
//   -e "import('./dist/sendEmail.js').then(m=>m.sendEmail({to:'you@example.com',subject:'Test',text:'Hello'})).then(console.log).catch(console.error)"
// sendEmail.ts
// Lightweight email utility for a Node.js server using SMTP (via Nodemailer)
//
// ✅ API: sendEmail({ to, subject, text })
// - `to`: string or string[] — recipient(s)
// - `subject`: string — subject line
// - `text`: string — plain-text body
//
// 🔧 Configuration via environment variables:
// - SMTP_HOST: SMTP server hostname (e.g., smtp.gmail.com)
// - SMTP_PORT: SMTP port (465 for SSL, 587 for STARTTLS)
// - SMTP_USER: SMTP username
// - SMTP_PASS: SMTP password
// - SMTP_SECURE: "true" to enforce SSL (usually with port 465)
// - MAIL_FROM: default From address (e.g., "Example <no-reply@example.com>")
//
// Install: npm i nodemailer && npm i -D @types/nodemailer typescript
// Usage (ESM):
//   import { sendEmail } from './sendEmail.js'; // after TS build emits .js
//   await sendEmail({ to: 'user@example.com', subject: 'Hi', text: 'Hello world' });
//
// Suggested tsconfig.json excerpt for ESM targets:
// {
//   "compilerOptions": {
//     "target": "ES2022",
//     "module": "ES2022",
//     "moduleResolution": "Bundler",
//     "strict": true,
//     "outDir": "dist",
//     "esModuleInterop": true,
//     "forceConsistentCasingInFileNames": true
//   },
//   "include": ["./**/*.ts"]
// }

// Optional: quick CLI usage for manual testing (after build)
// Build: tsc
// Run: node --env-file=.env dist/sendEmail.js \
//   -e "import('./dist/sendEmail.js').then(m=>m.sendEmail({to:'you@example.com',subject:'Test',text:'Hello'})).then(console.log).catch(console.error)"
