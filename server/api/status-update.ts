import { IncomingMessage, TwilioIncoming } from '~/types/types';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = twilio(accountSid, authToken);

	const body = await readBody(event);

	try {
		console.log(body);
		const { data, error } = await supabase
			.from('sent_messages')
			.update({ status: body.MessageStatus })
			.eq('sid', body.MessageSid);
		if (!!error) {
			throw error;
		}
		return { data };
	} catch (error) {
		console.log(error);
		throw error;
	}
});
