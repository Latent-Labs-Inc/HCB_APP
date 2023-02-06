export default defineEventHandler((event) => {
	const secret = useRuntimeConfig().private.SECRET;
	const headers = getHeaders(event);
	if (
		event.path === '/api/supabase-key' &&
		headers['x-hasura-admin-secret'] !== secret
	) {
		console.log('Forbidden');
		return {
			status: 403,
			data: 'Forbidden',
		};
	} else {
		console.log('OK');
	}
});
