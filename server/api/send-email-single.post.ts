import { serverSupabaseClient } from '#supabase/server';
import nodemailer from 'nodemailer';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const body: {
		to: string;
		message: string;
		subject: string;
		html?: string;
	} = await readBody(event);

	const config = useRuntimeConfig().private;

	let transporter = nodemailer.createTransport({
		host: config.EMAIL_HOST,
		port: 587,
		secure: false,
		auth: {
			user: config.EMAIL_USER,
			pass: config.EMAIL_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	try {
		const info = await transporter.sendMail({
			from: config.EMAIL_FROM,
			to: body.to,
			subject: body.subject,
			text: body.message,
			html: body.html || body.message,
		});

		console.log('Message sent: %s', info.messageId);

		return {
			statusCode: 200,
			body: info,
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify(error),
		};
	}
});
