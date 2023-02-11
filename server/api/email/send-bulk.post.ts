import { serverSupabaseClient } from '#supabase/server';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { Database } from '~~/types/supabase';

interface EmailObject {
	attorneyEmail: string;
	subject: string;
	attorneyName: string;
	prName: string;
	address1: string;
	city: string;
	state: string;
	zip: string;
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default defineEventHandler(async (event) => {
	const emailObjects = (await readBody(event)) as EmailObject[];

	const config = useRuntimeConfig().private;

	const client = serverSupabaseClient<Database>(event);

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

	const sendEmails = async (emailObjects: EmailObject[]) => {
		let logs = [] as {
			id: string | null;
			error: string | null;
			email: string;
		}[];
		emailObjects.forEach(async (emailObject) => {
			try {
				wait(300);
				const info = await transporter.sendMail({
					from: config.EMAIL_FROM,
					to: 'lukelongo0421@gmail.com',
					subject: emailObject.subject,
					// @ts-ignore
					template: 'email.attorney',
					context: {
						attorneyName: emailObject.attorneyName,
						address1: emailObject.address1,
						city: emailObject.city,
						state: emailObject.state,
						zip: emailObject.zip,
						prName: emailObject.prName,
					},
				});

				// @ts-ignore
				console.log('Message sent: %s', info.messageId);
				logs.push({
					// @ts-ignore
					id: info.messageId,
					error: null,
					email: emailObject.attorneyEmail,
				});
			} catch (error) {
				console.log(error);
				logs.push({
					id: null,
					error: error as string,
					email: emailObject.attorneyEmail,
				});
			}
		});
		return logs;
	};

	// now you will pass an array of emails to reference against the supabase table and see if they are included in the table or not
	let logs;
	try {
		const emails = emailObjects.map((emailObject) => emailObject.attorneyEmail);
		const { data, error } = await client
			.from('attorney_emails')
			.select('*')
			.in('email', emails);
		let attorneyEmails = data as { email: string; user_id: string }[];
		if (error) throw error;
		if (!attorneyEmails) {
			// now you will send the emails
			logs = await sendEmails(emailObjects);
		} else {
			// filter out the emails that are already in the table
			const filteredEmails = emailObjects.filter((emailObject) => {
				const found = attorneyEmails.find((attorneyEmail) => {
					return attorneyEmail.email === emailObject.attorneyEmail;
				});
				if (!found) return emailObject;
			});
			// now you will send the emails
			logs = await sendEmails(filteredEmails);
		}
		return {
			data: logs,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			data: logs,
			error: error,
		};
	}
});
