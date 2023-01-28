import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';
import { Lead, Message } from '~/types/types';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const supabase = createClient(
		config.public.SUPABASE_URL,
		config.private.SUPABASE_SERVICE_KEY
	);

	const client = twilio(accountSid, authToken);

	const { message, to, user_id, lead_id } = await readBody(event);

	let sentMessage: Message;

	let lead: Lead;

	try {
		const { data, error } = await supabase
			.from('leads')
			.select('*')
			.eq('lead_id', lead_id)
			.eq('user_id', user_id);
		if (error) {
			throw error;
		}
		lead = data[0];
	} catch (error) {
		console.log(error);
	}

	try {
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
	} catch (error) {
		console.log(error);
	}

	try {
		const { data, error } = await supabase
			.from('sent_messages')
			.insert(sentMessage);
		if (error) {
			throw error;
		}
	} catch (error) {
		console.log(error);
	}
	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'success' }),
	};
});
