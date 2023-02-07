import twilio from 'twilio';
import { Lead, Message } from '~/types/types';
import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const supabase = serverSupabaseClient<Database>(event);

	const client = twilio(accountSid, authToken);

	const body = await readBody(event);

	const user_id = event.context.auth?.user?.user_id;
	console.log(user_id);

	const { message, to, lead_id } = await readBody(event);

	try {
		let sentMessage: Message;

		let lead: Lead;
		const { data, error } = await supabase
			.from('leads')
			.select('*')
			.eq('lead_id', lead_id)
			.single();
		if (error) {
			throw error;
		}
		if (!data) {
			lead = data;

			const res = await client.messages.create({
				body: message,
				from: config.private.TWILIO_PHONE_NUMBER,
				to,
			});
			console.log(res);
			if (!!res.errorMessage) {
				throw res.errorMessage;
			}
			sentMessage = {
				message: message,
				to: to,
				from: config.private.TWILIO_PHONE_NUMBER,
				user_id,
				sent_at: new Date(),
				created_at: new Date(),
				updated_at: new Date(),
				sid: res.sid || useUuid(),
				status: res.status,
				errorCode: res.errorCode,
				errorMessage: res.errorMessage,
				direction: res.direction,
				lead_id,
				propertyAddress: lead.propertyAddress,
			};
			const { error: err } = await supabase
				.from('sent_messages')
				.insert(sentMessage);

			if (err) {
				throw error;
			}
		}
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
