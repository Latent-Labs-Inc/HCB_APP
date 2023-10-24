import sgMail from '@sendgrid/mail';

export const useSendEmailNotification = async (email: {
	email_to: string | string[];
	subject: string;
	message: string;
}) => {
	const config = useRuntimeConfig();
	const { SENDGRID_API_KEY } = config.private;

	const FROM_EMAIL = 'chad@highestcashbuyer.com';

	try {
		// check if env variables are set
		if (!SENDGRID_API_KEY) throw new Error('Missing Sendgrid API Key');

		sgMail.setApiKey(SENDGRID_API_KEY);

		const msg: sgMail.MailDataRequired = {
			to: email.email_to,
			from: FROM_EMAIL,
			subject: email.subject,
			text: email.message,
			replyTo: FROM_EMAIL,
		};

		const res = await sgMail.send(msg);

		return { data: res, error: null };
	} catch (error) {
		console.error(error);
		return { data: null, error };
	}
};
