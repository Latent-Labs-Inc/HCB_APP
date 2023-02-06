import { serverSupabaseServiceRole } from '#supabase/server';
import { Database } from '~/types/supabase';

export default defineEventHandler(async (event) => {
	const supabase = serverSupabaseServiceRole<Database>(event);

	return {
		status: 200,
		data: supabase,
	};
});
