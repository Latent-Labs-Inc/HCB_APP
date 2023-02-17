import { serverSupabaseClient } from '#supabase/server';
import { EmailObject } from '~~/types/types';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const transporter = useCreateTransporter();

	const client = serverSupabaseClient<Database>(event);

	const config = useRuntimeConfig().private;

	let err: string = '';

	const user_id = event.context.auth.user.id;

	const { emailObject, type } = (await readBody(event)) as {
		emailObject: EmailObject;
		type: 'probateRelative' | 'probateAttorney';
	};

	const sendEmail = async (emailObject: EmailObject) => {
		try {
			const mailOptions = {
				from: config.EMAIL_USER,
				to: emailObject.email,
				subject: emailObject.subject,
				template: 'email.probate',
				context: {
					name: emailObject.name,
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
						err = error.message as string;
						reject({
							error,
							email: emailObject.email,
							data: null,
						});
					} else {
						console.log('Email sent: ' + info.response);
						resolve({
							error: null,
							email: emailObject.email,
							data: info.response,
						});
					}
				});
			});
		} catch (error) {
			console.log(error);
			return {
				error: error as Error,
				email: emailObject.email,
				data: null,
			};
		}
	};

	const log = await sendEmail(emailObject);

	try {
		const { error } = await client.from('email_campaigns').insert({
			user_id,
			id: useUuid(),
			email: emailObject.email,
			name: emailObject.name,
			type,
			address_1: emailObject.address1,
			city: emailObject.city,
			state: emailObject.state,
			zip: emailObject.zip,
			sent_at: new Date().toISOString(),
		});
		if (error) throw error;
	} catch (error) {
		console.log(error);
	}

	return {
		data: log,
		error: err,
	};
});
