import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';
import { useCreateTransporter } from '~~/server/utils/useCreateTransporter';
import { RelEmailObject } from '~~/types/types';
import useUuid from '~~/server/utils/useUuid';

export default defineEventHandler(async (event) => {
	const client = serverSupabaseClient<Database>(event);
	const transporter = useCreateTransporter();
	const { emailObjects } = (await readBody(event)) as {
		emailObjects: RelEmailObject[];
	};

	const user_id = event.context.auth.user.id;
	const config = useRuntimeConfig().private;

	const sendEmail = async (emailObject: RelEmailObject) => {
		try {
			const mailOptions = {
				from: config.EMAIL_USER,
				to: 'lukelongo0421@gmail.com',
				subject: emailObject.subject,
				template: 'email.probate-relative',
				context: {
					relName: emailObject.relName,
					address1: emailObject.address1,
					city: emailObject.city,
					state: emailObject.state,
					zip: emailObject.zip,
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
							email: emailObject.relEmail,
							data: null,
						});
					} else {
						console.log('Email sent: ' + info.response);
						resolve({
							error: null,
							email: emailObject.relEmail,
							data: info.response,
						});
					}
				});
			});
		} catch (error) {
			console.log(error);
			return {
				error: error as Error,
				email: emailObject.relEmail,
				data: null,
			};
		}
	};

	const sendEmails = async (emailObjects: RelEmailObject[]) => {
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
					const { error: insertError } = await client
						.from('email_campaigns')
						.insert({
							id: useUuid(),
							email: emailObject.relEmail,
							user_id,
							sent_at: new Date().toISOString(),
							address_1: emailObject.address1,
							city: emailObject.city,
							state: emailObject.state,
							zip: emailObject.zip,
							rel_name: emailObject.relName,
							type: 'probateRelative',
						});

					if (insertError) throw insertError;
				} catch (error) {
					console.log(error);
				}
			}
		}
		return logs;
	};

	// will want to double check the emails table to make sure we do not double email anyone
	try {
		const { data, error } = await client
			.from('email_campaigns')
			.select('*')
			.in(
				'email',
				emailObjects.map((obj) => obj.relEmail)
			);
		if (error) throw error;
		// filter out all the emails from the emailObjects that are already in the emails table
		const filteredEmailObjects =
			data.length > 0
				? emailObjects.filter(
						(obj) => !data.some((d) => d.email === obj.relEmail)
				  )
				: emailObjects;

		// now we will send the emails, we can do the promise method or we can not depending on the user experience

		const results = sendEmails(filteredEmailObjects);

		// now we will insert the emails into the emails table
		return {
			data: results,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			data: null,
			error,
		};
	}
});
