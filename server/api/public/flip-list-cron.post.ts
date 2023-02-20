export default defineEventHandler(async (event) => {
	const { apiKey } = (await readBody(event)) as { apiKey: string };
	console.log(apiKey);
	const { CRON_API_KEY } = useRuntimeConfig().private;
	if (apiKey !== CRON_API_KEY) {
		return {
			error: 'Unauthorized',
			data: null,
		};
	}
	try {
		const { data, error } = await $fetch('/api/puppeteer/flip-list', {
			method: 'GET',
		});
		console.log(data, error);
	} catch (e) {
		console.log(e);
	}

	return {
		error: null,
		data: 'Success',
	};
});
