import axios from 'axios';
import dotenv from 'dotenv';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
	console.log('Cron job ran at ' + new Date().toLocaleString());
	// 0. Load environment variables
	dotenv.config();
	const { CRON_API_KEY: apiKey } = process.env;
	console.log('apiKey', apiKey);
	let appUrl = 'https://app.highestcashbuyer.com/api/public/flip-list-cron';
	try {
		const response = axios.post(
			appUrl,
			{
				apiKey,
			},
			{
				method: 'POST',
			}
		);
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
	}
};

export { handler };
