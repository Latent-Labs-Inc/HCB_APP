import { serverSupabaseClient } from '#supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '~~/types/supabase';
import { Lead, SentMessage } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const { twilioClient, twilioNumber } = useTwilio();

	const { lead, message } = (await readBody(event)) as {
		lead: Lead;
		message: string;
	};
	const user_id = event.context.auth.user.id;

	const supabaseClient = serverSupabaseClient<Database>(event);

	const checkBadNumber = async (wireless: string) => {
		let badNumber = false;
		try {
			const { data, error } = await supabaseClient
				.from('bad_numbers')
				.select('*')
				.eq('wireless', wireless)
				.single();

			if (error) throw error;
			if (data) badNumber = true;
			console.log('bad_number', data);
		} catch (error: any) {
			throw error;
		} finally {
			return badNumber;
		}
	};

	const sendText = async () => {
		let logs: {
			data: string | null;
			error: string | null;
			supabaseError: PostgrestError | null;
		}[] = [];
		for (const wireless of lead.wireless!) {
			if (!wireless) continue;
			// check supabase bad_numbers table for number
			// if number is bad, skip
			// if number is good, send text
			if (await checkBadNumber(wireless)) continue;

			let log: {
				data: string | null;
				error: string | null;
				supabaseError: PostgrestError | null;
			} = { data: null, error: null, supabaseError: null };

			try {
				const res = await twilioClient.messages.create({
					body: message,
					from: twilioNumber,
					to: wireless,
				});
				if (res.errorMessage) throw new Error(res.errorMessage);
				log.data = res.sid;
				// update the sent messages table to include the message
				let sentMessage: SentMessage = {
					user_id: user_id,
					lead_id: lead.lead_id,
					message: message,
					sid: res.sid,
					direction: res.direction,
					status: res.status,
					errorCode: res.errorCode.toString(),
					errorMessage: res.errorMessage,
					from: res.from,
					to: res.to,
					created_at: res.dateCreated.toDateString(),
					sent_at: res.dateSent.toDateString(),
					updated_at: res.dateUpdated.toDateString(),
					propertyAddress: lead.propertyAddress,
				};
				const { data, error } = await supabaseClient
					.from('sent_messages')
					.insert(sentMessage);
				if (error) throw error;
			} catch (error: any) {
				log.error = error.message;
			} finally {
				try {
					const { data, error } = await supabaseClient
						.from('leads')
						// @ts-ignore
						.update({ texted: true })
						.eq('lead_id', lead.lead_id);
					if (error) throw error;
				} catch (error: any) {
					log.supabaseError = error;
				} finally {
					logs.push(log);
				}
			}
		}
		return logs;
	};

	const logs = await sendText();

	let errors: string[] = [];

	if (logs.some((log) => log.error)) {
		errors.push('There was an error sending the text.');
	}

	if (logs.some((log) => log.supabaseError)) {
		errors.push('There was an error updating the lead.');
	}

	return {
		data: logs,
		error: errors.length ? errors.join(' ') : null,
	};
});
