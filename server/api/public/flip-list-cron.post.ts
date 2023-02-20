export default defineEventHandler(async (event) => {
	const { apiKey } = (await readBody(event)) as { apiKey: string };
	const { CRON_API_KEY } = useRuntimeConfig().private;
	if (apiKey !== CRON_API_KEY) {
		return {
			error: 'Unauthorized',
			data: null,
		};
	}

	$fetch('/api/puppeteer/flip-list', {
		method: 'GET',
	});

	return {
		error: null,
		data: 'Success',
	};
});
