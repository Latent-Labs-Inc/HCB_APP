import { IncomingMessage, TwilioIncoming } from '~/types/types';
import twilio from 'twilio';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = twilio(accountSid, authToken);

	const body = await readBody(event);
});
