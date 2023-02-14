import twilio from 'twilio';

import { serverSupabaseClient } from '#supabase/server';
import { Lead, TwilioResponse } from '~~/types/types';
import { Database } from '~~/types/supabase';

export default defineEventHandler(async (event) => {
	const { leads, user_id, message } = await readBody(event);
	const supabase = serverSupabaseClient<Database>(event);
	const config = useRuntimeConfig();

	const accountSid = config.private.TWILIO_ACCOUNT_SID;
	const authToken = config.private.TWILIO_AUTH_TOKEN;
	const twilioNumber = config.private.TWILIO_PHONE_NUMBER;

	const client = twilio(accountSid, authToken);

	let error = null as Error | null;

	let messageCounter = 0;

	// create a promise for each lead that does not resolve until all the messages are sent
	const promises = leads.map(async (lead: Lead) => {
		lead.wireless!.forEach(async (wireless: string) => {
			try {
				// check if number is in badNumbers
				const { data, error } = await supabase
					.from('bad_numbers')
					.select('*')
					.eq('number', wireless);
				if (error) throw error;
				if (data.length > 0) {
					console.log('bad_number');
					return;
				} else {
					const twilioResponse = await client.messages.create({
						body: message,
						from: twilioNumber,
						to: wireless,
					});
					if (twilioResponse.errorMessage)
						throw new Error(twilioResponse.errorMessage);
					messageCounter++;
					console.log(messageCounter);
					// update the number to the list of badNumbers to prevent double texts
					try {
						const { data, error } = await supabase
							.from('bad_numbers')
							.insert({ user_id, number: wireless });
						if (error) throw error;
					} catch (error) {
						console.log(error);
						error = error;
					}
				}
			} catch (error) {
				console.log(error);
				error = error;
			}
		});
		// update the lead to texted in db
		try {
			const { data, error } = await supabase
				.from('leads')
				// @ts-ignore
				.update({ texted: true })
				.eq('lead_id', lead.lead_id);
			if (error) throw error;
		} catch (error) {
			console.log(error);
			error = error;
			return {
				data: messageCounter,
				error,
			};
		}
	});

	// you can choose to await all the promises here or not, I am choosing not to
	Promise.all(promises);

	return {
		data: messageCounter,
		error,
	};
});
