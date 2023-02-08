import twilio from 'twilio';
import { Lead } from '~/types/types';
import { serverSupabaseServiceRole } from '#supabase/server';
import { Database, Json } from '~/types/supabase';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const supabase = serverSupabaseServiceRole<Database>(event);

	const client = twilio(accountSid, authToken);

	const { message, to, lead_id, user_id } = await readBody(event);

	// const user_id_context = event.context.auth?.user?.user_id;
	// console.log(user_id_context);

	// console.log(user_id, message);

	try {
		let sentMessage: Database['public']['Tables']['sent_messages']['Row'];

		let lead: Lead;

		const { data, error } = await supabase
			.from('leads')
			.select('*')
			.eq('lead_id', lead_id)
			.single();
		if (error) throw error;
		lead = data;

		const res = await client.messages.create({
			body: message,
			from: config.private.TWILIO_PHONE_NUMBER,
			to,
		});

		console.log(res);

		if (res.errorMessage) throw res.errorMessage;

		sentMessage = {
			message: message,
			to: to,
			from: config.private.TWILIO_PHONE_NUMBER,
			user_id,
			sent_at: new Date().toISOString(),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			sid: res.sid || useUuid(),
			status: res.status,
			errorCode: res.errorCode as unknown as string,
			errorMessage: res.errorMessage,
			direction: res.direction,
			lead_id,
			propertyAddress: lead.propertyAddress as unknown as Json,
		};

		const { error: err } = await supabase
			.from('sent_messages')
			.insert(sentMessage);

		if (err) throw error;
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ message: 'error' }),
		};
	}
	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'success' }),
	};
});
