import { IncomingMessage, TwilioIncoming } from '~/types/types';
import twilio from 'twilio';
import { serverSupabaseServiceRole } from '#supabase/server';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const supabase = serverSupabaseServiceRole<Database>(event);

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = twilio(accountSid, authToken);

	const body: TwilioIncoming = await readBody(event);

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
