import { IncomingMessage, TwilioIncoming, Lead } from '~/types/types';
import { Database } from '~/types/supabase';
import twilio from 'twilio';
import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const supabase = serverSupabaseClient<Database>(event);
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

	let user_id: string | null = null;

	try {
		// getting user id from phone number
		const { data } = await supabase
			.from('profiles')
			.select('*')
			.contains('phoneNumbers', [body.To])
			.single();

		if (data) {
			user_id = data.user_id;
		}
	} catch (error) {
		console.log(error);
	}

	// will need to clean this up to use user_id's if making public app
	let leads = [] as Lead[];

	if (user_id) {
		try {
			const { data, error } = await supabase
				.from('leads')
				.select('*')
				.eq('user_id', user_id)
				.contains('wireless', [body.From]);
			if (error) {
				throw error;
			}
			leads = data.map((lead) => lead);
		} catch (error) {
			console.log(error);
		}
	}

	// if (leads.length > 1) {
	// 	console.log('more than one lead found with that number');
	// 	let counter = 0;
	// 	leads.forEach(async (lead) => {
	// 		const propertyAddress = !!lead.propertyAddress
	// 			? lead.propertyAddress
	// 			: { address1: 'None Found', city: '', state: '', zip: '' };
	// 		let incoming_message: IncomingMessage = {
	// 			user_id: user_id!,
	// 			message: body.Body,
	// 			from: body.From,
	// 			to: body.To,
	// 			sid: body.MessageSid + `-${counter}`,
	// 			created_at: new Date().toISOString(),
	// 			sent_at: new Date().toISOString(),
	// 			updated_at: new Date().toISOString(),
	// 			status: body.MessageStatus,
	// 			direction: 'inbound',
	// 			errorCode: '',
	// 			errorMessage: '',
	// 			lead_id: lead.lead_id,
	// 			propertyAddress: propertyAddress,
	// 		};
	// 		counter++;
	// 		try {
	// 			const { error } = await supabase
	// 				.from('incoming_messages')
	// 				.insert(incoming_message);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	});
	// } else {
	// 	const propertyAddress = !!leads[0]?.propertyAddress
	// 		? leads[0].propertyAddress
	// 		: { address1: 'None Found', city: null, state: null, zip: null };
	// 	let incoming_message: IncomingMessage = {
	// 		user_id: user_id!,
	// 		message: body.Body,
	// 		from: body.From,
	// 		to: body.To,
	// 		sid: body.MessageSid,
	// 		created_at: new Date().toISOString(),
	// 		sent_at: new Date().toISOString(),
	// 		updated_at: new Date().toISOString(),
	// 		status: body.MessageStatus,
	// 		direction: 'inbound',
	// 		errorCode: '',
	// 		errorMessage: '',
	// 		lead_id: !!leads[0]?.lead_id ? leads[0].lead_id : null,
	// 		propertyAddress: propertyAddress,
	// 	};

	// 	try {
	// 		const { error } = await supabase
	// 			.from('incoming_messages')
	// 			.insert(incoming_message);

	// 		if (error) {
	// 			throw error;
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	return;
});
