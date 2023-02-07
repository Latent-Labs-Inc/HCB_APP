import { TwilioIncoming } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const body: TwilioIncoming = await readBody(event);
	const config = useRuntimeConfig();

	if (body.AccountSid === config.private.TWILIO_ACCOUNT_SID) {
		const data = await $fetch('/api/incoming-message', {
			method: 'POST',
			body,
		});
		return {
			data,
			message: 'OK',
			error: null,
		};
	} else {
		console.log('Invalid Twilio AccountSid');
		return {
			data: null,
			message: 'Invalid Twilio AccountSid',
			error: 'Invalid Twilio AccountSid',
		};
	}
});
