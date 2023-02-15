import { useCreateTransporter } from '~~/server/utils/useCreateTransporter';
import { StandardEmailObject } from '~/types/types';

export default defineEventHandler(async (event) => {
	const transporter = useCreateTransporter();
	const emailObject = (await readBody(event)) as StandardEmailObject;
	const config = useRuntimeConfig().private;

	const sendEmail = async (emailObject: StandardEmailObject) => {
		try {
			const mailOptions = {
				from: config.EMAIL_USER,
				to: 'lukelongo0421@gmail.com',
				subject: emailObject.subject,
				template: 'email.probate-standard',
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

	const result = await sendEmail(emailObject);
	console.log(result);

	return {
		data: result,
		error: result.error,
	};
});
