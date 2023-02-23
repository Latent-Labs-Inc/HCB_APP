import { EmailObject } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig().private;

	const transporter = useCreateTransporter();
	const { emailObject, type } = (await readBody(event)) as {
		emailObject: EmailObject;
		type:
			| 'cashOffer'
			| 'probate'
			| 'eviction'
			| 'codeViolation'
			| 'foreclosure';
	};

	const sendEmail = async (emailObject: EmailObject) => {
		try {
			const mailOptions = {
				from: config.EMAIL_USER,
				to: emailObject.email,
				subject: emailObject.subject,
				template: `email.${type}`,
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

	return {
		data: result,
		error: result.error,
	};
});
