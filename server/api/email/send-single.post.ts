import { serverSupabaseClient } from '#supabase/server';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const {
		to,
		message,
		subject,
		attorneyName,
		address1,
		address2,
		city,
		state,
		zip,
		prName,
	} = (await readBody(event)) as {
		to: string;
		message: string;
		subject: string;
		attorneyName: string;
		address1: string;
		address2?: string;
		city: string;
		state: string;
		zip: string;
		prName: string;
	};

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

	transporter.use(
		'compile',
		hbs({
			viewEngine: {
				extname: '.hbs',
				partialsDir: path.resolve('./views'),
				defaultLayout: false,
			},
			viewPath: path.resolve('./views'),
			extName: '.hbs',
		})
	);

	try {
		const info = await transporter.sendMail({
			from: config.EMAIL_FROM,
			to: to,
			subject: subject,
			// @ts-ignore
			template: 'email.attorney',
			context: {
				attorneyName,
				address1,
				address2: address2 ? address2 : '',
				city,
				state,
				zip,
				prName,
			},
		});

		// @ts-ignore
		console.log('Message sent: %s', info.messageId);

		return {
			data: info,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			error: error,
			data: error,
		};
	}
});
