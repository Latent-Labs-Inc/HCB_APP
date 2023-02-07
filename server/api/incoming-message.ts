import { TwilioIncoming } from '~/types/types';
import { Database, Json } from '~/types/supabase';
import twilio from 'twilio';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body: TwilioIncoming = await readBody(event);

	const supabase = serverSupabaseServiceRole<Database>(event);

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	if (body.AccountSid !== accountSid) {
		return {
			data: null,
			message: 'Invalid Twilio AccountSid',
			error: 'Invalid Twilio AccountSid',
		};
	}
	const authToken = config.private.TWILIO_AUTH_TOKEN;
	const client = twilio(accountSid, authToken);

	const contactPhoneNumbers = ['+18134084221'];

	let supabaseError: Error | null = null;

	contactPhoneNumbers.forEach(async (number) => {
		let regex = /stop|no|harassment|fuck/gi;
		if (!body.Body.match(regex)) {
			await client.messages.create({
				body: `New message from ${body.From} to ${body.To} with message: ${body.Body}`,
				from: config.private.TWILIO_PHONE_NUMBER,
				to: number,
			});
		}
	});

	try {
		// getting user id from phone number
		const { data, error: err } = await supabase
			.from('profiles')
			.select('*')
			.contains('phoneNumbers', [body.To])
			.single();
		if (err) throw err;

		const user_id = data.user_id;
		if (!user_id)
			return {
				statusCode: 500,
				body: 'user not found',
			};

		const { data: leads, error } = await supabase
			.from('leads')
			.select('*')
			.eq('user_id', user_id)
			.contains('wireless', [body.From]);
		if (error || !leads) {
			throw error || 'No leads found';
		}

		leads.forEach(async (lead) => {
			const propertyAddress = !!lead.propertyAddress
				? lead.propertyAddress
				: { address1: 'None Found', city: '', state: '', zip: '' };

			let incoming_message = {
				user_id: user_id!,
				message: body.Body,
				from: body.From,
				to: body.To,
				sid: body.MessageSid,
				created_at: new Date().toISOString(),
				sent_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				status: body.MessageStatus,
				direction: 'inbound',
				errorCode: '',
				errorMessage: '',
				lead_id: lead.lead_id,
				propertyAddress: propertyAddress as unknown as Json,
			};

			try {
				const { error } = await supabase
					.from('incoming_messages')
					.insert(incoming_message);
				if (error) {
					throw error;
				}
			} catch (error) {
				supabaseError = error as Error;
				console.log(error);
			}
		});

		return {
			statusCode: 200,
			body: 'success',
			supabaseError,
			user_id,
			leads,
			from: body.From,
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: error,
			supabaseError,
		};
	}
});
