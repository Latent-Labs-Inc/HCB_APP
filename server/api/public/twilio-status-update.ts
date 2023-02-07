import { TwilioIncoming } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const body: TwilioIncoming = await readBody(event);
	const config = useRuntimeConfig();

	if (body.AccountSid === config.private.TWILIO_ACCOUNT_SID) {
		await $fetch('/api/status-update', {
			method: 'POST',
			body,
		});
		return {
			data: null,
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
