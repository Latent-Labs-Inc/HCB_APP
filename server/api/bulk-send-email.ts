import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const client = serverSupabaseClient(event);
});
