import twilio from 'twilio';
import { serverSupabaseServiceRole } from '#supabase/server';
import { Database } from '~/types/supabase';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const { phone, message } = (await readBody(event)) as {
		phone: string;
		message: string;
	};

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

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
