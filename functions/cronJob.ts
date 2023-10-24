import axios from 'axios';
import dotenv from 'dotenv';
import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const handler: Handler = async (event, context) => {
	try {
		console.log('Cron job ran at ' + new Date().toLocaleString());
		// 2. Call API
		dotenv.config();
		const { CRON_API_KEY: apiKey, BASE_URL } = process.env;

		let appUrl = `${BASE_URL}/api/public/flip-list-cron`;

		const response = await axios.post(
			appUrl,
			{
				apiKey,
			},
			{
				method: 'POST',
				timeout: 30000,
			}
		);

		console.log('ran axios request');
		return {
			statusCode: 200,
			body: JSON.stringify('Cron job ran successfully'),
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify(error),
		};
	} finally {
		console.log('cron job attempted to run');
		return {
			statusCode: 200,
			body: JSON.stringify('Cron job ran successfully'),
		};
	}
};

export { handler };
