import twilio from 'twilio';

import { serverSupabaseClient } from '#supabase/server';
import { Lead, TwilioResponse } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const { leads, user_id, message } = await readBody(event);
	const supabase = serverSupabaseClient(event);
	const config = useRuntimeConfig();

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;
	const twilioNumber = config.private.TWILIO_PHONE_NUMBER;

	const client = twilio(accountSid, authToken);

	let error = null as Error | null;

	let messageCounter = 0;
	leads.forEach(async (lead: Lead) => {
		lead.wireless.forEach(async (wireless: string) => {
			try {
				const twilioResponse = await client.messages.create({
					body: message,
					from: twilioNumber,
					to: wireless,
				});
				if (twilioResponse.errorMessage)
					throw new Error(twilioResponse.errorMessage);
				console.log(twilioResponse);
				messageCounter++;
			} catch (error) {
				console.log(error);
				error = error;
			}
		});

		try {
			await supabase
				.from('leads')
				// @ts-ignore
				.update({ texted: true })
				.eq('lead_id', lead.lead_id);
		} catch (error) {
			console.log(error);
			error = error;
		}
	});

	return {
		data: messageCounter,
		error,
	};
});
