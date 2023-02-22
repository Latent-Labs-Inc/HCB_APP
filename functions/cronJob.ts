import axios from 'axios';
import dotenv from 'dotenv';
import { Handler } from '@netlify/functions';

const handler: Handler = async (event, context) => {
	console.log('Cron job ran at ' + new Date().toLocaleString());
	// 0. Load environment variables
	dotenv.config();
	const { API_KEY: apiKey } = process.env;
	console.log('apiKey', apiKey);
	let appUrl = 'https://app.highestcashbuyer.com/api/public/flip-list-cron';
	try {
		const response = await axios.post(
			appUrl,
			{
				apiKey,
			},
			{
				method: 'POST',
			}
		);
		console.log('data', response.data.data);
		console.log('error', response.data.error);
		return {
			statusCode: 200,
			body: JSON.stringify(response.data),
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
