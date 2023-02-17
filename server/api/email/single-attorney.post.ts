import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';
import { AttorneyEmailObject } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const { emailObject, type } = (await readBody(event)) as {
		emailObject: AttorneyEmailObject;
		type: string;
	};

	const config = useRuntimeConfig().private;

	const transporter = useCreateTransporter();

	const sendEmail = async (emailObject: AttorneyEmailObject) => {
		const { email, subject, name, prName, address1, city, state, zip } =
			emailObject;
		const mailOptions = {
			from: config.EMAIL_USER,
			to: email,
			subject: subject,
			template: 'email.attorney',
			context: {
				name,
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
	};

	try {
		// now you will send the emails
		const data = await sendEmail(emailObject);

		return {
			data,
			error: null,
		};
	} catch (error) {
		console.log(error);
		return {
			data: null,
			error: error,
		};
	}
});
