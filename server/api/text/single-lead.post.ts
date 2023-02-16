import { serverSupabaseClient } from '#supabase/server';
import { PostgrestError } from '@supabase/supabase-js';
import { Lead } from '~~/types/types';

export default defineEventHandler(async (event) => {
	const { twilioClient, twilioNumber } = useTwilio();

	const { lead, message } = (await readBody(event)) as {
		lead: Lead;
		message: string;
	};
	const supabaseClient = serverSupabaseClient(event);

	const sendText = async () => {
		let logs: {
			data: string | null;
			error: string | null;
			supabaseError: PostgrestError | null;
		}[] = [];
		for (const wireless of lead.wireless!) {
			if (!wireless) continue;
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
