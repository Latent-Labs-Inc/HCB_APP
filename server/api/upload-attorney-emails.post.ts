import { serverSupabaseClient } from '#supabase/server';
import { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
	const body: {
		data: {
			email: string;
			user_id: string;
		}[];
	} = await readBody(event);

	const supabase = serverSupabaseClient<Database>(event);

	try {
		const { data, error } = await supabase
			.from('attorney_emails')
			.insert(body.data);
		if (error) throw error;
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify(error),
		};
	} finally {
		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'success' }),
		};
	}
});
