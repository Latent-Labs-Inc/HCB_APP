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
		}
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
		// now we have the emails already sent, so we will filter out the ones that have already been sent from the emailObjects array
		const filteredEmailObjects =
			data.length > 0
				? emailObjects.filter((obj) =>
						data.find((email) => email.email === obj.relEmail)
				  )
				: emailObjects;
		// now we will send the emails, we can do the promise method or we can
		const results = await Promise.all(
			filteredEmailObjects.map((obj) => sendEmail(obj))
		);
		// now we will insert the emails into the emails table
		const { error: insertError } = await client.from('email_campaigns').insert(
			filteredEmailObjects.map((obj) => ({
				id: useUuid(),
				email: obj.relEmail,
				user_id,
				address_1: obj.address1,
				city: obj.city,
				state: obj.state,
				zip: obj.zip,
				type: 'probate',
				sent_at: new Date().toISOString(),
			}))
		);
		if (insertError) throw insertError;

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
