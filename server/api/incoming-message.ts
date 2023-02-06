import { TwilioIncoming } from '~/types/types';
import { Database, Json } from '~/types/supabase';
import twilio from 'twilio';
import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const supabase = serverSupabaseServiceRole<Database>(event);
	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;

	const client = twilio(accountSid, authToken);

	const body: TwilioIncoming = await readBody(event);

	const contactPhoneNumbers = ['+18134084221'];

	contactPhoneNumbers.forEach(async (number) => {
		let regex = /stop|no|harassment|fuck/gi;
		if (!body.Body.match(regex)) {
			const res = await client.messages.create({
				body: `New message from ${body.From} to ${body.To} with message: ${body.Body}`,
				from: config.private.TWILIO_PHONE_NUMBER,
				to: number,
			});
		}
	});

	try {
		// getting user id from phone number
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.contains('phoneNumbers', [body.To])
			.single();
		if (error) throw error;

		const user_id = data.user_id;
		if (user_id) {
			try {
				const { data: leads, error } = await supabase
					.from('leads')
					.select('*')
					.eq('user_id', user_id)
					.contains('wireless', [body.From]);
				if (error || !leads) {
					throw error;
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
						console.log(error);
					}
				});
				return {
					statusCode: 200,
					body: 'success',
				};
			} catch (error) {
				console.log(error);
				return {
					statusCode: 500,
					body: error,
				};
			}
		} else {
			return {
				statusCode: 500,
				body: 'user not found',
			};
		}
	} catch (error) {
		console.log(error);
	}
});
