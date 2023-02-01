import twilio from 'twilio';
import { serverSupabaseClient } from '#supabase/server';
import { Lead, Message, Filter, TwilioResponse } from '../../types/types';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

export default defineEventHandler(async (event) => {
	const { phone, message } = (await readBody(event)) as {
		phone: string;
		message: string;
	};

	console.log(phone, message);

	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;
	const twilioNumber = config.private.TWILIO_PHONE_NUMBER;

	const client = twilio(accountSid, authToken);

	try {
		console.log('Sending message to', phone);
		const twilioResponse = await client.messages.create({
			body: message,
			from: twilioNumber,
			to: phone,
		});
		if (twilioResponse.errorMessage)
			throw new Error(twilioResponse.errorMessage);
		console.log(twilioResponse);
		return {
			data: twilioResponse,
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
