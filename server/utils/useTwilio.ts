import twilio from 'twilio';

export const useTwilio = () => {
	const config = useRuntimeConfig().private;

	const twilioClient = twilio(
		config.TWILIO_ACCOUNT_SID,
		config.TWILIO_AUTH_TOKEN
	);

	const twilioNumber = config.TWILIO_PHONE_NUMBER;

	return { twilioClient, twilioNumber };
};
