import { serverSupabaseClient } from '#supabase/server';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const body: {
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
	} = await readBody(event);

	const config = useRuntimeConfig().private;

	const __dirname = path.resolve();

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
			to: body.to,
			subject: body.subject,
			// @ts-ignore
			template: 'email.attorney',
			context: {
				name: body.attorneyName,
				text: body.message,
				address1: body.address1,
				address2: body.address2 ? body.address2 : '',
				city: body.city,
				state: body.state,
				zip: body.zip,
				prName: body.prName,
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
