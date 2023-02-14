import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';
import { useCreateTransporter } from '~~/server/utils/useCreateTransporter';
import { RelEmailObject } from '~~/types/types';

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
				to: emailObject.relEmail,
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
		}
	};

	// will want to double check the emails table to make sure we do not double email anyone
	try {
		const { data, error } = await client
			.from('emails')
			.select('*')
			.in(
				'email',
				emailObjects.map((obj) => obj.relEmail)
			);
		if (error) throw error;
		// now we have the emails already sent, so we will filter out the ones that have already been sent from the emailObjects array
		const filteredEmailObjects = emailObjects.filter(
			(obj) => !data.find((email) => email.email === obj.relEmail)
		);
		// now we will send the emails, we can do the promise method or we can
		const results = await Promise.all(
			filteredEmailObjects.map((obj) => sendEmail(obj))
		);
	} catch (error) {
		console.log(error);
	}
});
