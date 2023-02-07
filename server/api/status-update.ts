import { TwilioIncoming } from '~/types/types';
import { serverSupabaseServiceRole } from '#supabase/server';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body: TwilioIncoming = await readBody(event);

	const supabase = serverSupabaseServiceRole<Database>(event);

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	if (body.AccountSid !== accountSid) {
		console.log('Invalid Twilio AccountSid');
		return {
			data: null,
			message: 'Invalid Twilio AccountSid',
			error: 'Invalid Twilio AccountSid',
		};
	}

	try {
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
