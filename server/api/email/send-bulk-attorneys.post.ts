import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';
import { EmailObject } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const emailObjects = (await readBody(event)) as EmailObject[];

	const config = useRuntimeConfig().private;

	const user_id = event.context.auth.user.id;

	const client = serverSupabaseClient<Database>(event);

	const transporter = useCreateTransporter();

	const sendEmail = async (emailObject: EmailObject) => {
		const {
			attorneyEmail,
			subject,
			attorneyName,
			prName,
			address1,
			city,
			state,
			zip,
		} = emailObject;
		const mailOptions = {
			from: config.EMAIL_USER,
			to: attorneyEmail,
			subject: subject,
			template: 'email.attorney',
			context: {
				attorneyName,
				prName,
				address1,
				city,
				state,
				zip,
			},
		};
		return new Promise<{
			error: Error | null;
			email: string;
			data: string | null;
		}>((resolve, reject) => {
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
					reject({
						error,
						email: emailObject.attorneyEmail,
						data: null,
					});
				} else {
					console.log('Email sent: ' + info.response);
					resolve({
						error: null,
						email: emailObject.attorneyEmail,
						data: info.response,
					});
				}
			});
		});
	};

	const sendEmails = async (emailObjects: EmailObject[]) => {
		let logs: {
			error: Error | null;
			email: string;
			data: string | null;
		}[] = [];
		for (let i = 0; i < emailObjects.length; i++) {
			const emailObject = emailObjects[i];
			const log = await sendEmail(emailObject);
			logs.push(log);
			if (!log.error) {
				// insert into the attorney_emails table
				try {
					const { data, error } = await client
						.from('attorney_emails')
						.insert([{ email: emailObject.attorneyEmail, user_id }]);
					if (error) throw error;
				} catch (error) {
					console.log(error);
				}
			}
		}
		return logs;
	};

	let logs;

	try {
		const emails = emailObjects.map((emailObject) => emailObject.attorneyEmail);
		const { data: attorneyEmails, error } = await client
			.from('attorney_emails')
			.select('*')
			.in('email', emails);

		if (error) throw error;

		// filter out the emails that are already in the table, use conditional to check and if false use standard object
		const filteredEmails =
			attorneyEmails.length > 0
				? emailObjects.filter((emailObject) => {
						const found = attorneyEmails.find((attorneyEmail) => {
							return attorneyEmail.email === emailObject.attorneyEmail;
						});

						if (!found) return emailObject;
				  })
				: emailObjects;

		// now you will send the emails
		logs = await sendEmails(filteredEmails);

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
