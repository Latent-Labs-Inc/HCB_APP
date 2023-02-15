import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~~/types/supabase';
import { EmailObject } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const { emailObject, type } = (await readBody(event)) as {
		emailObject: EmailObject;
		type: string;
	};

	const config = useRuntimeConfig().private;

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
